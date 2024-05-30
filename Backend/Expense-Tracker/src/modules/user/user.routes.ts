// USER routes

import { FastifyInstance } from "fastify";
import { registerHandler } from "./user.controller";





// User Routes FUnction
export async function userRoutes(app: FastifyInstance) {

    // // get user profile
    // app.get('/profile',
    //     userProfileHandler
    // );

    // user Register route
    /*
    {
        "name": "test",
        "email": "abc@xyz.com",
        "password": "123456"
    }
    */
    app.post('/register',
        registerHandler
    );

    // // user login route
    // app.post('/login',
    //     loginHandler
    // );
}