// All Accounts Routes
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { userInRequestPreHandler } from "../../utils/auth";
import { getAccountDataByYearMonthTypeCategoryWiseHandler, getAccountDataByYearMonthHandler, getCurrentMonthAccountHandler, getAccountDataByYearMonthTypeHandler } from "./account.controller";
import { getAccountDataByYearMonthTypeParamsPrehandler } from "./account.schema";



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

    // account data by year and month -> category wise total (for visualisation)
    app.get(
        '/:year/:month/:type',
        {
            preHandler: [
                userInRequestPreHandler, // check if user is logged in using token
                getAccountDataByYearMonthTypeParamsPrehandler // validate request params
            ]
        },
        getAccountDataByYearMonthTypeHandler
    )


    // account data by year and month -> category wise total (for visualisation)
    app.get(
        '/:year/:month/:type/category-wise/',
        {
            preHandler: [
                userInRequestPreHandler, // check if user is logged in using token
                getAccountDataByYearMonthTypeParamsPrehandler // validate request params
            ]
        },
        getAccountDataByYearMonthTypeCategoryWiseHandler
    )


}