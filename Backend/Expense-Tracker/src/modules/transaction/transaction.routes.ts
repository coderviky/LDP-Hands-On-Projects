// TRANSACTION ROUTES

import { create } from "domain";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { createTransactionJsonSchema } from "./transaction.schema";
import { createTransactionHandler, deleteTransactionByIdHandler, getAllTransactionsHandler, getTransactionByIdHandler, updateTransactionByIdHandler } from "./transaction.controller";
import { userInRequestPreHandler } from "../../utils/auth";
import { get } from "http";


// transaction reoute function

export async function transactionRoutes(app: FastifyInstance) {

    // get all transactions
    app.get(
        '/all',
        {
            preHandler: userInRequestPreHandler
        },
        getAllTransactionsHandler
    )

    // create transaction
    /*
    {
        "date": "2024-05-01",
        "amount": 1000,
        "type": "income",
        "category": "salary",
        "description": "salary for july"
    }
    {
        "date": "2024-04-01",
        "amount": 5000,
        "type": "income",
        "category": "salary",
        "description": "salary for apr 24"
    }

    {
        "date": "2024-05-28",
        "amount": 200,
        "type": "expense",
        "category": "food"
    }
    */
    app.post(
        '/',
        {
            schema: createTransactionJsonSchema,
            preHandler: userInRequestPreHandler
        },
        createTransactionHandler
    );


    // get transaction by id
    /*  665863033c70075c2582090f  */
    app.get(
        '/:id',
        {
            preHandler: userInRequestPreHandler
        },
        getTransactionByIdHandler
    );


    // update transaction by id
    /*
    {
        "date": "2024-05-27",
        "amount": 200,
        "type": "expense",
        "category": "food"
    }
    */
    app.put(
        '/:id',
        {
            schema: createTransactionJsonSchema,
            preHandler: userInRequestPreHandler
        },
        updateTransactionByIdHandler
    );


    // delete transaction by id
    app.delete(
        '/:id',
        {
            preHandler: userInRequestPreHandler,
        },
        deleteTransactionByIdHandler
    );

}