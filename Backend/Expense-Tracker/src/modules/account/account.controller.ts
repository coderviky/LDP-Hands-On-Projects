// ALL Acount Related Routes Logic Part

import { FastifyReply, FastifyRequest, RouteGenericInterface } from "fastify";
import { getAccountDataByYearMonth } from "./account.service";




// get current month account data handler
export async function getCurrentMonthAccountHandler(request: FastifyRequest, reply: FastifyReply) {
    // get user id from request token
    const userId = request.user.id;

    // get current month and year
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();


    // get account data by year and month and user id
    const data = await getAccountDataByYearMonth(userId, currentYear, currentMonth);

    const balance = data[0]?.totalIncome + data[0]?.totalExpense;
    // const balance = data[0]?.income.total - data[0]?.expense.total;

    const isData: boolean = data.length > 0;

    reply.send({ userId, currentYear, currentMonth, balance, isData, ...data[0] });
    // reply.send(data);

    // const incomeData = data.find(d => d._id === 'income');
    // const expenseData = data.find(d => d._id === 'expense');

    // reply.send({
    //     userId,
    //     currentMonth,
    //     currentYear,
    //     balance: (incomeData?.total || 0) + (expenseData.total || 0),
    //     incomeTotal: incomeData?.total || 0,
    //     expenseTotal: expenseData.total || 0,
    //     incomeTransactions: incomeData?.transactions || [],
    //     expenseTransactions: expenseData.transactions || []
    // });

}


interface CreateAccountDataByYearMonthRouteInterface extends RouteGenericInterface {
    Params: { year: string, month: string }
}

// get account data by month and year handler
export async function getAccountDataByYearMonthHandler(
    request: FastifyRequest<CreateAccountDataByYearMonthRouteInterface>,
    reply: FastifyReply) {
    // get user id from request token
    const userId = request.user.id;

    // get year and month from request params
    const year = parseInt(request.params.year);
    const month = parseInt(request.params.month);


    // get account data by year and month and user id
    const data = await getAccountDataByYearMonth(userId, year, month);

    const balance = data[0]?.totalIncome + data[0]?.totalExpense;

    // const balance = data[0]?.income.total - data[0]?.expense.total;
    const isTransactionDetailsData: boolean = data.length > 0;

    reply.send({ userId, year, month, balance, isTransactionDetailsData, ...data[0] });
    // reply.send(data);



}