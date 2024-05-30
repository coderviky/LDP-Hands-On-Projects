// USER routes logic part

import { FastifyReply, FastifyRequest } from "fastify";
import { CreateUserSchema, LoginUserSchema } from "./user.schema";
import { User } from "../../db/models";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";


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



// Login user route handler - with schema validation
export async function loginHandler(
    request: FastifyRequest<{
        Body: LoginUserSchema
    }>,
    reply: FastifyReply) {

    // get user data from request
    const data = request.body;

    // find user by email
    const user = await User.findOne({ email: data.email });

    if (!user) {
        return reply.code(404).send({
            message: "User not found"
        })
    }

    // verify password
    const isPasswordValid = await argon2.verify(user.password, data.password);

    if (!isPasswordValid) {
        return reply.code(401).send({
            message: "Invalid password"
        })
    }

    // generate jwt token
    const token = await jwt.sign(
        {
            id: user._id,
            email: user.email
        },
        env.JWT_SECRET as string
    )

    // response with token
    reply.code(200).send(token)

}