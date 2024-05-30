// Teansaction Routes Logic Part

import { FastifyReply, FastifyRequest } from "fastify";
import { CreateTransactionSchema } from "./transaction.schema";
import { Transaction } from "../../db/models";


// Create Transaction Handler function
export async function createTransactionHandler(
    request: FastifyRequest<{
        Body: CreateTransactionSchema
    }>,
    reply: FastifyReply
) {
    // get user id from request object
    const userId = request.user.id;

    // get transaction data from request body
    const data = request.body;

    // if type is expense then amount should be negative
    if (data.type === 'expense') {
        data.amount = data.amount * -1;
    }

    console.log("data", { ...data, userId });

    // create transaction with user id
    const transaction = new Transaction({ userId, ...data })

    try {
        // save transaction in mongo db
        await transaction.save();

        // response
        reply.code(201).send({
            message: "Transaction created successfully",
            data: transaction
        })
    } catch (error) {
        // error response
        reply.code(500).send({
            message: "Internal Server Error",
        })

    }
}