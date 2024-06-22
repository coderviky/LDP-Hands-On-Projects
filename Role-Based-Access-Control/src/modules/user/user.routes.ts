// USER Routes

import { create } from "domain";
import { FastifyInstance } from "fastify";
import { assignRoleToUserJsonSchema, createUserJsonSchema, loginUserJsonSchema } from "./user.schema";
import { assignRoleToUserHandler, createUserHandler, loginUserHandler } from "./user.controller";
import { assignRoleToUser } from "./user.services";
import { PERMISSIONS, USER_ROLE_WRITE } from "../../config/permissions";


export async function userRoutes(app: FastifyInstance) {

    // create a user
    app.post("/", {
        schema: createUserJsonSchema
    },
        createUserHandler
    )

    // login user
    app.post("/login",
        {
            schema: loginUserJsonSchema
        },
        loginUserHandler
    )

    // assign role to user
    app.post("/role-assign",
        {
            schema: assignRoleToUserJsonSchema,
            preHandler: [app.guard.scope([PERMISSIONS[USER_ROLE_WRITE]])]
        },
        assignRoleToUserHandler
    )
    // json 
    /*
    {
        "userId": {{user_ID}},
        "roleId": {{role_ID}}
    }
    */
}