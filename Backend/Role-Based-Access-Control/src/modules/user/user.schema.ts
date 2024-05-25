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