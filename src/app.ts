import express, { Request, Response } from 'express';
import dotenv from 'dotenv'
dotenv.config();

import 'reflect-metadata'
import './di'
import userRoutes from './routes/userRoutes'
import connectDB from './config/db';
import { errorHandler } from './middlewares/errorHandler';
import { notFound } from './middlewares/notFound';
import morganMiddleware from './middlewares/morganMiddleware';
import adminRoutes from './routes/adminRoutes'

import cookieParser from 'cookie-parser';
import cors from 'cors'
import { seedAdmin } from './seed/seedAdmin';
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './docs/swagger';
import mongoose from 'mongoose';
import { STATUS_CODES } from './constants/statusCodes';
import { seedPlan } from './seed/seedPlan';
 

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}))


app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(morganMiddleware)


app.use('/api/v1/user',userRoutes) 
app.use('/api/v1/admin',adminRoutes)

//swagger api docs
app.use('/docs',swaggerUi.serve,swaggerUi.setup(swaggerSpec))

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
