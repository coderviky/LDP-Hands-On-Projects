// All Accounts Routes
import { FastifyInstance } from "fastify";
import { userInRequestPreHandler } from "../../utils/auth";
import { getAccountDataByYearMonthHandler, getCurrentMonthAccountHandler } from "./account.controller";
import { getAccountDataByYearMonth } from "./account.service";



export async function accountRoutes(app: FastifyInstance) {

    // current month account data for user id from request token
    app.get(
        '/current-month',
        {
            preHandler: userInRequestPreHandler // check if user is logged in using token
        },
        getCurrentMonthAccountHandler
    )

    // get account data by year and month and user id
    app.get(
        '/:year/:month',
        {
            preHandler: userInRequestPreHandler // check if user is logged in using token
        },
        getAccountDataByYearMonthHandler
    )




    // account data for {year}{month} for user id from request token

}