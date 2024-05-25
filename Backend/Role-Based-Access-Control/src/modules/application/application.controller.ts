// APPLICATION Route Logic Part

import { FastifyRequest, FastifyReply } from "fastify";
import { CreateApplicationBody } from "./application.schema";
import { createApplicationInDB, getAllApplicationsFromDB } from "./application.services";


// create application route handler function
export async function createApplicationHandler(
    request: FastifyRequest<{
        Body: CreateApplicationBody
    }>,
    reply: FastifyReply
) {
    // get the body from the request
    const data = request.body;

    // create application in the database
    const application = await createApplicationInDB(data);

    // create super admin role for the application in role table in db


    // create application user role for the application in role table in db


    reply.code(201).send(application);

}



// get all applications route handler function
export async function getApplicationsHandler(
    request: FastifyRequest,
    reply: FastifyReply
) {
    // get all applications from the database
    const applications = await getAllApplicationsFromDB();

    reply.code(200).send(applications);

}