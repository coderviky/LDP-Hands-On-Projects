// TRANSACTION ROUTES

import { create } from "domain";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { createTransactionJsonSchema } from "./transaction.schema";
import { createTransactionHandler } from "./transaction.controller";
import { userInRequestPreHandler } from "../../utils/auth";


// transaction reoute function

export async function transactionRoutes(app: FastifyInstance) {

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


    // update transaction by id


    // delete transaction by id

}