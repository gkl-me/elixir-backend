import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes'
import connectDB from './config/db';
import { errorHandler } from './middlewares/errorHandler';
import { notFound } from './middlewares/notFound';
import morganMiddleware from './middlewares/morganMiddleware';
import adminRoutes from './routes/adminRoutes'
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';


dotenv.config();

const app = express();
app.use(express.json());

app.use(cookieParser())
app.use(morganMiddleware)


app.use('/api/v1/users',userRoutes) 
app.use('/api/v1/admin',adminRoutes)

app.use(errorHandler)
app.use(notFound)

app.listen(5000, async ()=>{
    await connectDB()
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

    process.exit(0);
});
