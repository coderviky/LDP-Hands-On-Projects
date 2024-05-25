// USER Routes

import { create } from "domain";
import { FastifyInstance } from "fastify";
import { createUserJsonSchema } from "./user.schema";
import { createUserHandler } from "./user.controller";


export async function userRoutes(app: FastifyInstance) {

    // create a user
    app.post("/", {
        schema: createUserJsonSchema
    },
        createUserHandler
    )
}