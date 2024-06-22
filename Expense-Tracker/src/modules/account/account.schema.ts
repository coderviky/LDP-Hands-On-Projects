// Account related schemas
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';


// account data by year month type schema
export const getAccountDataByYearMonthTypeParamsSchema = z.object({
    year: z.string(),
    month: z.string(),
    type: z.enum(['expense', 'income'])
});

export type GetAccountDataByYearMonthTypeParamsSchema = z.infer<typeof getAccountDataByYearMonthTypeParamsSchema>;

// params validator as prehandler
export async function getAccountDataByYearMonthTypeParamsPrehandler(request: FastifyRequest, reply: FastifyReply) {
    try {
        request.params = getAccountDataByYearMonthTypeParamsSchema.parse(request.params);
    } catch (error) {
        // send error response
        reply.code(400).send(error);
    }
}