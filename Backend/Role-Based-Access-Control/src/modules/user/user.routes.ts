// USER Routes

import { create } from "domain";
import { FastifyInstance } from "fastify";
import { createUserJsonSchema, loginUserJsonSchema } from "./user.schema";
import { createUserHandler, loginUserHandler } from "./user.controller";


export async function userRoutes(app: FastifyInstance) {

    // create a user
    app.post("/", {
        schema: createUserJsonSchema
    },
        createUserHandler
    )

    // login user
    app.post("/login", {
        schema: loginUserJsonSchema
    },
        loginUserHandler
    )
}