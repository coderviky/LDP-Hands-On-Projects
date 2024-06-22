// APPPLICATION schemas using zod
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'


// Application Schemas


// create application body schema
const createApplicationBodySchema = z.object(
    {
        name: z.string()
    }
);

export type CreateApplicationBody = z.infer<typeof createApplicationBodySchema>;

export const createApplicationJsonSchema = {
    body: zodToJsonSchema(createApplicationBodySchema, "createApplicationBodySchema")
}

