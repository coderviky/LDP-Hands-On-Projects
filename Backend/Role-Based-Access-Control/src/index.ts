import Fastify, { FastifyReply, FastifyRequest } from 'fastify'
import { pino } from 'pino'
import { db } from './db/db'
import { userRoutes } from './modules/user/user.routes'
import { applicationRoute } from './modules/application/application.routes'
import jwt from 'jsonwebtoken'
import { env } from './config/env'
import guard from 'fastify-guard'
import { roleRoutes } from './modules/role/roles.routes'

// create logger with pino
const logger = pino({
    level: 'info',
    transport: {
        target: 'pino-pretty',
    }
})

// Request extension -------------
// add user to request object
type UserInRequest = {
    id: number,
    email: string,
    applicationId: number,
    scopes: Array<string>
}

declare module 'fastify' {
    interface FastifyRequest {
        user: UserInRequest
    }
}
// -------------------


// $$$$$$$$$$$$$$$$ ---------------------
// create fastify server with logger enabled with pino
const app = Fastify({
    logger
})

app.decorateRequest('user', null);

// REGISTER HOOK for user token decode
app.addHook("onRequest", async function (request: FastifyRequest, reply: FastifyReply) {

    // check header for token -  "Bearer token"
    const authHeader = request.headers.authorization;

    if (!authHeader) {
        return; // do nothing if token is not present
    }

    // if token is present in header then decode it
    const token = authHeader.split(" ")[1];
    // decode token
    const decodedUser = await jwt.verify(token, env.JWT_SECRET as string);

    // add user to request object
    request.user = decodedUser as UserInRequest;

});


// REGISTER GUARD PLUGIN
app.register(guard, {
    requestProperty: "user", // in user will be available in request by hook
    scopeProperty: "scopes", // scopes available in user object and will be use in prehandler to check permissions
    errorHandler: (result, request: FastifyRequest, reply: FastifyReply) => {
        reply.code(403).send({
            message: "You do not have permission to access this api"
        })
    }
})

//-------------------



// START SERVER
app.listen({ port: 3000 }, (error, address) => {
    if (error) {
        app.log.error(error);
        process.exit(1);
    }
});


// define a home route 
app.get('/', (request, reply) => {
    reply.send("Hello World")
})


// ############ REGISTER ROUTES ############
// register user routes
app.register(userRoutes, { prefix: "api/user" });
// register application routes
app.register(applicationRoute, { prefix: "api/application" });
// register roles routes
app.register(roleRoutes, { prefix: "api/role" });