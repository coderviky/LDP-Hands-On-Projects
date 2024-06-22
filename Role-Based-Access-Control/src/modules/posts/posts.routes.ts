// POSTS Routes
import { FastifyInstance } from 'fastify';
import { PERMISSIONS, POST_WRITE } from '../../config/permissions';
import { createPostJsonSchema } from './posts.shema';
import { createPostHandler, getAllPostsHandler } from './posts.controller';


// posts routes function
export async function postsRoutes(app: FastifyInstance) {


    // create post
    app.post(
        '/',
        {
            schema: createPostJsonSchema,
            preHandler: [app.guard.scope([PERMISSIONS[POST_WRITE]])]
        },
        createPostHandler
    )

    // get all posts
    app.get(
        '/',
        getAllPostsHandler
    )

}