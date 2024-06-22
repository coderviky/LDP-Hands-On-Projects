// Separate server creation and route registration
// useful in testing as we can create server and register routes separately
import Fastify, { FastifyReply, FastifyRequest } from 'fastify'
import { logger } from './config/logger'
import jwt from 'jsonwebtoken'
import { env } from './config/env'

// routes import
import { userRoutes } from './modules/user/user.routes'
import { transactionRoutes } from './modules/transaction/transaction.routes'
import { accountRoutes } from './modules/account/account.routes'

// Request extension -------------
// add user to request object
type UserInRequest = {
    id: string,  // in mongo db it will be object id
    email: string
}


declare module 'fastify' {
    interface FastifyRequest {
        user: UserInRequest
    }
}

// -------------------

export function createFastifyApp() {

    console.log("JWT_SECRET : ", env.JWT_SECRET)

    // $$$$$$$$$$$$$$$$ ---------------------
    // create fastify server with logger enabled with pino
    const app = Fastify({
        logger
    })

    app.decorateRequest('user', null);  // add user to request object

    // REGISTER HOOK for user token decode
    app.addHook("onRequest", async function (request: FastifyRequest, reply: FastifyReply) {

        // check header for token -  "Bearer token"
        const authHeader = request.headers.authorization;

        if (!authHeader) {
            return; // do nothing if token is not present
        }

        // if token is present in header then decode it
        const token = authHeader.split(" ")[1];
        // logger.info("token - ", token);
        // decode token
        const decodedUser = await jwt.verify(token, env.JWT_SECRET as string);

        // logger.info("decodedUser", decodedUser);

        // add user to request object
        request.user = decodedUser as UserInRequest;

    });

    // define a home route 
    app.get('/', (request, reply) => {
        reply.send("EXPENSE TRACKER API")
    })


    // ############ REGISTER ROUTES ############
    // register user routes
    app.register(userRoutes, { prefix: "api/user" });
    // register transaction routes
    app.register(transactionRoutes, { prefix: "api/transaction" });
    // register account routes
    app.register(accountRoutes, { prefix: "api/account" });

    // sample post route
    app.post('/', (request: FastifyRequest<{ Body: { name: string } }>,
        reply: FastifyReply
    ) => {
        const { name } = request.body;
        reply.code(201).send({ name })
    })

    return app;

}

