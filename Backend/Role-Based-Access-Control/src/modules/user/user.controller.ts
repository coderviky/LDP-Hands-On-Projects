// User Routes Logic Part
import { FastifyRequest, FastifyReply } from "fastify";
import { CreateUserBody } from "./user.schema";
import { createUserInDB } from "./user.services";


// create user route handler function
export async function createUserHandler(
    request: FastifyRequest<{
        Body: CreateUserBody
    }>,
    reply: FastifyReply
) {
    // get the body from the request
    const data = request.body;

    // create user in the database
    const user = await createUserInDB(data);

    reply.code(201).send(user);


}