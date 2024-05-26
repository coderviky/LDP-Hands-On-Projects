// ROLES routes
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { PERMISSIONS, USER_ROLE_WRITE } from '../../config/permissions';
import { createRoleJsonSchema } from './roles.schema';
import { createRoleHandler } from './roles.controller';



// Role Reoutes 
export async function roleRoutes(app: FastifyInstance) {
    // get all routes


    // create a role
    app.post('/', {
        schema: createRoleJsonSchema,
        preHandler: [app.guard.scope([PERMISSIONS[USER_ROLE_WRITE]])]
    },
        createRoleHandler
    );

    /*
    Sample Request Json
    {
        "name": "post-moderator",
        "permissions": ["post:read", "post:delete"]
    }
    */

}