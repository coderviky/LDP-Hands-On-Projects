// APPLICATION Routes Logic Part
import { FastifyInstance } from "fastify";
import { createApplicationJsonSchema } from "./application.schema";
import { createApplicationHandler, getApplicationsHandler } from "./application.controller";


// application route
export async function applicationRoute(app: FastifyInstance) {

    // post method to create an application
    app.post("/", {
        schema: createApplicationJsonSchema
    }, createApplicationHandler);

    // get method to get all applications
    app.get("/", getApplicationsHandler);
}   