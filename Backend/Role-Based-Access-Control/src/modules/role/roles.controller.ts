// ROLE routes logic part

import { FastifyRequest, FastifyReply } from "fastify";
import { CreateRoleBody } from "./roles.schema";
import { createRoleInDB } from "./roles.services";


// create role handler
export async function createRoleHandler(
    request: FastifyRequest<{
        Body: CreateRoleBody
    }>,
    reply: FastifyReply
) {
    // get user from request & applicationId from user
    const user = request.user;
    const applicationId = user.applicationId;

    // get data from the request
    const data = request.body;

    // create role in the database
    const role = await createRoleInDB({
        name: data.name,
        applicationId,
        permissions: data.permissions
    });

    // send the role data in response
    reply.code(201).send(role);
}