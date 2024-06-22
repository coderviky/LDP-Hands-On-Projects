// POSTS logic part

import { FastifyReply, FastifyRequest, RouteGenericInterface } from "fastify";
import { CreatePostSchema } from "./posts.shema";
import { createPostInDB, getAllPostsFromDB } from "./posts.services";


// interface for create post handler
interface CreatePostRoutgeInsterface extends RouteGenericInterface {
    Body: CreatePostSchema
}

// create post handler
export async function createPostHandler(
    request: FastifyRequest<CreatePostRoutgeInsterface>,
    reply: FastifyReply) {
    // get data from request
    const data = request.body;

    // create post
    const post = await createPostInDB(data);

    // send response
    reply.code(201).send(post);

}


// get all posts handler
export async function getAllPostsHandler(
    request: FastifyRequest,
    reply: FastifyReply) {
    // get all posts
    const posts = await getAllPostsFromDB();

    // send response
    reply.send(posts);

}