// TRANSACTION Schemas
import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

// create transaction schema
const createTransactionSchema = z.object({
    // userId: z.string(),  // we will get userId from token
    date: z.string().date(),
    amount: z.number(),
    type: z.enum(['income', 'expense']),
    category: z.string().optional(),
    description: z.string().optional()
})

// type
export type CreateTransactionBody = z.infer<typeof createTransactionSchema>;

// jsonschema
export const createTransactionJsonSchema = {
    body: zodToJsonSchema(createTransactionSchema, "createTransactionSchema")
}