// User Routes Schemas
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'


// User Schemas

const createUserBodySchema = z.object(
    {
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6),
        applicationId: z.number(),
        initialuser: z.boolean().optional()
    }
);

export const createUserJsonSchema = {
    body: zodToJsonSchema(createUserBodySchema, "createUserBodySchema")
}

export type CreateUserBody = z.infer<typeof createUserBodySchema>;


// login user schema
const loginUserBodySchema = z.object(
    {
        email: z.string().email(),
        password: z.string().min(6),
        applicationId: z.number()
    }
);

export const loginUserJsonSchema = {
    body: zodToJsonSchema(loginUserBodySchema, "loginUserBodySchema")
}

export type LoginUserBody = z.infer<typeof loginUserBodySchema>;



// assign role to user schema
const assignRoleToUserBodySchema = z.object(
    {
        userId: z.number(),
        roleId: z.number()
    }
);
// applicationId from user object in request

export type AssignRoleToUserBody = z.infer<typeof assignRoleToUserBodySchema>;

export const assignRoleToUserJsonSchema = {
    body: zodToJsonSchema(assignRoleToUserBodySchema, "assignRoleToUserBodySchema")
}
