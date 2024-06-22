// ROLES schemas
import { z } from 'zod'
import { ALL_PERMISSIONS } from '../../config/permissions';
import zodToJsonSchema from 'zod-to-json-schema';




// create role schema
const createRoleBodySchema = z.object(
    {
        name: z.string(),
        // applicationId: z.number(), // no need, take it from user object in request
        permissions: z.array(z.enum(ALL_PERMISSIONS)),
    }
);

// type
export type CreateRoleBody = z.infer<typeof createRoleBodySchema>;

export const createRoleJsonSchema = {
    body: zodToJsonSchema(createRoleBodySchema, "createRoleBodySchema")
}