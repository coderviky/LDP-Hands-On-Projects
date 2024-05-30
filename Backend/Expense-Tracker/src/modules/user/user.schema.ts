// USER schemas
import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

// create user schemas 
const createUserSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6)
})


// type
export type CreateUserSchema = z.infer<typeof createUserSchema>;

// jsonschema
export const createUserJsonSchema = {
    body: zodToJsonSchema(createUserSchema, "createUserSchema")
}


// login user schemas
const loginUserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
})

export type LoginUserSchema = z.infer<typeof loginUserSchema>;

export const loginUserJsonSchema = {
    body: zodToJsonSchema(loginUserSchema, "loginUserSchema")
}