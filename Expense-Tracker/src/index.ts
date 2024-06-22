import { FastifyInstance } from 'fastify';
import { env } from './config/env'
import { connectDB } from './db/db'

// import create fastify app
import { createFastifyApp } from './server'

// ----------------------------

// connect to mongo db $$$$$
connectDB();



const app: FastifyInstance = createFastifyApp();


// START SERVER
app.listen({ port: env.PORT }, (error, address) => {
    // console.log("env.port ", env.PORT);
    if (error) {
        app.log.error(error);
        process.exit(1);
    }
});






