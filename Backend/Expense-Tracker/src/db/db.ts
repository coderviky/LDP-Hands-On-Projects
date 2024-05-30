// Mongo DB coneection 

import mongoose from 'mongoose';
import { env } from '../config/env';

export const connectDB = async () => {

    try {
        const conn = await mongoose.connect(env.MONGO_URI as string)
        console.log(`Mongo DB connected to ${conn.connection.host}`);
    } catch (error) {
        console.log(error);
    }
}