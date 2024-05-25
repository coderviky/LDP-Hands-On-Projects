import Fastify from 'fastify'
import { pino } from 'pino'
import { db } from './db/db'
import { userRoutes } from './modules/user/user.routes'
import { applicationRoute } from './modules/application/application.routes'

// create logger with pino
const logger = pino({
    level: 'info',
    transport: {
        target: 'pino-pretty',
    }
})

// create fastify server with logger enabled with pino
const app = Fastify({
    logger
})


// define a home route 
app.get('/', (request, reply) => {
    reply.send("Hello World")
})


// start server
app.listen({ port: 3000 }, (error, address) => {
    if (error) {
        app.log.error(error);
        process.exit(1);
    }
});


// register user routes
app.register(userRoutes, { prefix: "api/user" });
// register application routes
app.register(applicationRoute, { prefix: "api/application" });
