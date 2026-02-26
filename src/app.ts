import express, { Request, Response } from 'express';
import dotenv from 'dotenv'
dotenv.config();

import 'reflect-metadata'
import './di'
import connectDB from './config/db';
import { errorHandler } from './middlewares/errorHandler';
import { notFound } from './middlewares/notFound';
import morganMiddleware from './middlewares/morganMiddleware';

//route imports
import authRoutes from './routes/auth.routes'
import userRoutes from './routes/user.routes'
import planRoutes from './routes/plan.routes'
import onboardingRoutes from './routes/onboarding.routes'
import webhookRoutes from './routes/webhook.routes'
import paymentRoutes from './routes/payment.routes'

import cookieParser from 'cookie-parser';
import cors from 'cors'
import { seedAdmin } from './seed/seedAdmin';
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './docs/swagger';
import mongoose from 'mongoose';
import { STATUS_CODES } from './constants/statusCodes';
import { seedPlan } from './seed/seedPlan';
import { ENV } from './constants/env';
import { auth } from './middlewares/auth';
 

const app = express();

app.use(cors({
    origin: ENV.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}))

//webhooks
app.use('/api/v1/webhook',webhookRoutes)


app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(morganMiddleware)


app.use('/api/v1/auth',authRoutes) 
app.use('/api/v1/users',userRoutes) 
app.use('/api/v1/plans',planRoutes) 
app.use('/api/v1/onboarding',onboardingRoutes)
app.use('/api/v1/payment',paymentRoutes)

app.get('/api/v1/demo',auth,(req,res) => {
    res.json({
        message:"hello"
    })
})



//swagger api docs
// app.use('/docs',swaggerUi.serve,swaggerUi.setup(swaggerSpec))

//health check route
app.get('/ping',(req:Request,res:Response) => {
    const state = mongoose.connection.readyState
    if(state === 1){
        res.status(STATUS_CODES.OK).json({
            success:true,
            message:"Server running successfully",
            db:"Connected"
        })
    }else{
        res.status(STATUS_CODES.BAD_REQUEST).json({
            success:false,
            message:"Server is not healthy",
        })
    }
})

app.use(errorHandler)
app.use(notFound)

app.listen(5000, async ()=>{
    await connectDB()

    //seed admin to db
    await seedAdmin()

    //seed plan collection to db
    await seedPlan()

        
    console.log("Server is running on port 5000")
})


//shut down code for server and mongodb
process.on('SIGINT', async () => {

    console.log('Server is shutting down');
    try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed');

    } catch (error) {
        console.log('Error while closing mongoose connection',error)
    }

    console.log('Server shutdown complete')
    process.exit(0);
});
