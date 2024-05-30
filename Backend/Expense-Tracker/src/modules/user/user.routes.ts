// USER routes

import { FastifyInstance } from "fastify";
import { loginHandler, registerHandler } from "./user.controller";
import { createUserJsonSchema, loginUserJsonSchema } from "./user.schema";





// User Routes FUnction
export async function userRoutes(app: FastifyInstance) {



    // user Register route
    /*
    {
        "name": "test",
        "email": "abc@xyz.com",
        "password": "123456"
    }
    */
    app.post('/register',
        {
            schema: createUserJsonSchema
        },
        registerHandler
    );

    // // user login route
    app.post('/login',
        {
            schema: loginUserJsonSchema
        },
        loginHandler
    );








    // // get user profile
    // app.get('/profile',
    //     userProfileHandler
    // );
}