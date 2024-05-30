// autherization handler functions

import { FastifyReply, FastifyRequest } from "fastify";


export async function userInRequestPreHandler(request: FastifyRequest, reply: FastifyReply) {

    // check user is logged in
    if (!request.user) {
        reply.code(401).send({
            message: "Unauthorized"
        });
    }
    // if user is logged in then continue
}