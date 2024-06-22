// process the environment variables and returns them as an object
import dotenv from 'dotenv';

dotenv.config();


export const env = {
    PORT: process.env.PORT || 3000,
    DATABASE_CONNECTION: process.env.DATABASE_CONNECTION,
    JWT_SECRET: process.env.JWT_SECRET,
}



