// ALL Account related db functions

import { Transaction } from "../../db/models";
import { Types } from "mongoose";


// get account data by year and month and user id
export async function getAccountDataByYearMonth(userId: string, year: number, month: number) {

    // get account data by year and month and user id -> 1 document
    const data = await Transaction.aggregate([
        {
            $match: {
                userId: new Types.ObjectId(userId),
                date: {
                    $gte: new Date(year, month - 1, 1), // month is 0 based
                    $lt: new Date(year, month, 1)
                }
            }
        },
        // sort by date : recent first -> -1 descending order
        {
            $sort: { date: -1 }
        },
        {
            $group: {
                _id: null, // consider all documents
                totalExpense: {
                    $sum: {
                        $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0]
                    }
                },
                totalIncome: {
                    $sum: {
                        $cond: [{ $eq: ["$type", "income"] }, "$amount", 0]
                    }
                },
                expenseTransactions: {
                    $push: {
                        $cond: [
                            { $eq: ["$type", "expense"] },
                            {
                                _id: "$_id",
                                amount: "$amount",
                                type: "$type",
                                date: "$date",
                                category: "$category",
                                description: "$description"
                            },
                            "$$REMOVE"
                        ]
                    }
                },
                incomeTransactions: {
                    $push: {
                        $cond: [
                            { $eq: ["$type", "income"] },
                            {
                                _id: "$_id",
                                amount: "$amount",
                                type: "$type",
                                date: "$date",
                                category: "$category",
                                description: "$description"
                            },
                            "$$REMOVE"
                        ]
                    }
                }
            }
        },
        // {
        //     $project: {
        //         _id: 0,
        //         expense: {
        //             total: { $ifNull: ["$totalExpense", 0] },
        //             transactions: { $ifNull: ["$expenseTransactions", []] }
        //         },
        //         income: {
        //             total: { $ifNull: ["$totalIncome", 0] },
        //             transactions: { $ifNull: ["$incomeTransactions", []] }
        //         }
        //     }
        // }

    ]);

    // // get account data by year and month and user id -> 2 documents (income and expense)
    // const data = await Transaction.aggregate(
    //     [
    //         {
    //             $match: {
    //                 userId: new Types.ObjectId(userId),
    //                 date: {
    //                     $gte: new Date(year, month - 1, 1), // month is 0 based
    //                     $lt: new Date(year, month, 1)
    //                 }
    //             }
    //         },
    //         {
    //             $group: {
    //                 _id: "$type",
    //                 total: {
    //                     $sum: "$amount"
    //                 },
    //                 transactions: {
    //                     // $push: "$$ROOT"     get all fields
    //                     $push: {
    //                         _id: "$_id",
    //                         amount: "$amount",
    //                         type: "$type",
    //                         date: "$date",
    //                         category: "$category",
    //                         description: "$description"
    //                     }
    //                 }
    //             }
    //         }
    //     ]
    // )


    return data;

}




// Get account data by year and month -> category wise total (for visualisation)
export async function getAccountDataByYearMonthType(userId: string, year: number, month: number, type: 'expense' | 'income', isCategoryWise: boolean) {

    let aggregateStages: any[] = [
        {
            $match: {
                userId: new Types.ObjectId(userId),
                date: {
                    $gte: new Date(year, month - 1, 1), // month is 0 based
                    $lt: new Date(year, month, 1)
                },
                type: type  // filter by type
            }
        },
        // sort by date : recent first -> -1 descending order
        {
            $sort: { date: -1 }
        }
    ]


    // check if category wise grouping is required
    if (isCategoryWise) {
        // categorywise grouping 
        aggregateStages.push(
            {
                $group: {
                    _id: "$category", // consider all documents
                    total: {
                        $sum: "$amount"
                    },
                }
            },
        )
    } else { // only type wise filter so
        // project transactions data
        aggregateStages.push(
            {
                $project: {
                    _id: 1,
                    amount: 1,
                    type: 1,
                    date: 1,
                    category: 1,
                    description: 1
                }
            }
        )
    }

    // get account data by year and month and type and user id -> 1 document
    const data = await Transaction.aggregate(aggregateStages);

    return data;

}