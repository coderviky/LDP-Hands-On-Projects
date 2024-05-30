// USER routes logic part

import { FastifyReply, FastifyRequest } from "fastify";
import { CreateUserSchema } from "./user.schema";
import { User } from "../../db/models";
import argon2 from "argon2";


// register user route handler - with schema validation
export async function registerHandler(
    request: FastifyRequest<{
        Body: CreateUserSchema
    }>,
    reply: FastifyReply) {

    // get user data from request
    const data = request.body;

    // convert password to hashed password using bcrypt
    data.password = await argon2.hash(data.password);


    // create user
    const user = new User(data); // using mongoose model

    try {
        await user.save();  // save user in the database
        // reponse with user data
        reply.code(201).send(user);
    } catch (error) {
        console.log("Error creating user", error);
        // if error code 11000 then user already exist
        if ((error as any).code === 11000) {
            return reply.code(400).send({
                message: "User already exist"
            })
        }
        return reply.code(500).send({
            message: "Error creating user : " + (error as any)._message
        });
    }

}