// Teansaction Routes Logic Part

import { FastifyReply, FastifyRequest, RouteGenericInterface } from "fastify";
import { CreateTransactionBody } from "./transaction.schema";
import { Transaction } from "../../db/models";

// get all transactions handler function
export async function getAllTransactionsHandler(request: FastifyRequest, reply: FastifyReply) {
    // get user id from request object
    const userId = request.user.id;

    // get all transactions of user
    const transactions = await Transaction.find({ userId });

    // response
    reply.code(200).send(transactions);
}


interface CreateTransactionRouteInterface extends RouteGenericInterface {
    Body: CreateTransactionBody;
}

// Create Transaction Handler function
export async function createTransactionHandler(
    request: FastifyRequest<CreateTransactionRouteInterface>,
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



// params interface
interface GetDeleteTransactionByIdRouteInterface extends RouteGenericInterface {
    Params: { id: string }
}

// get transaction by id

// get transaction by id handler function
export async function getTransactionByIdHandler(
    request: FastifyRequest<GetDeleteTransactionByIdRouteInterface>,
    reply: FastifyReply
) {
    // get user id from request object
    const userId = request.user.id;

    // get transaction id from request params
    const { id } = request.params;

    // get transaction by id and user id
    const transaction = await Transaction.findOne({ _id: id, userId });

    if (!transaction) {
        // error response
        reply.code(404).send({
            message: "Transaction not found"
        })
    }

    // response
    reply.code(200).send(transaction)
}


// update transaction by id
// interface
interface UpdateTransactionByIdRouteInterface extends RouteGenericInterface {
    Params: { id: string },
    Body: CreateTransactionBody
}
export async function updateTransactionByIdHandler(
    request: FastifyRequest<UpdateTransactionByIdRouteInterface>,
    reply: FastifyReply
) {
    // get user id from request object
    const userId = request.user.id;

    // get transaction id from request params
    const { id } = request.params;

    // get transaction data from request body
    const data = request.body;

    // if type is expense then amount should be negative
    if (data.type === 'expense') {
        data.amount = data.amount * -1;
    }

    // update transaction by id and user id
    const transaction = await Transaction.findOneAndUpdate({ _id: id, userId }, data, { new: true });

    if (!transaction) {
        // error response
        reply.code(404).send({
            message: "Transaction not found"
        })
    }

    // response
    reply.code(200).send(transaction)
}


// delete transaction by id
export async function deleteTransactionByIdHandler(
    request: FastifyRequest<GetDeleteTransactionByIdRouteInterface>,
    reply: FastifyReply
) {
    // get user id from request object
    const userId = request.user.id;

    // get transaction id from request params
    const { id } = request.params;

    // delete transaction by id and user id
    const transaction = await Transaction.findOneAndDelete({ _id: id, userId });

    if (!transaction) {
        // error response
        reply.code(404).send({
            message: "Transaction not found"
        })
    }

    // response
    reply.code(200).send({
        message: `Transaction ${id} deleted successfully`
    })
}
