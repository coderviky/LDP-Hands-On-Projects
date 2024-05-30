// process the environment variables and returns them as an object
import dotenv from 'dotenv';

dotenv.config();


export const env = {
    PORT: Number(process.env.PORT) || 3000,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
}