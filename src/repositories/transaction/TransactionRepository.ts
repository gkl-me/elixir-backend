import { injectable } from "tsyringe";
import { ITransaction, Transaction } from "../../models/Transaction";
import { BaseRepository } from "../base/BaseRepository";
import { IGetAllTransaction, IGetAllTransactionsRes, ITransactionRepository } from "./interface/ITransactionRepository";
import { logError } from "../../middlewares/loggerHelper";


@injectable()
export class TransactionRepository extends BaseRepository<ITransaction> implements ITransactionRepository {
    constructor() {
        super(Transaction)
    }

    async getAllTransactions(query: IGetAllTransaction): Promise<IGetAllTransactionsRes> {
        try {

            const { search, status, skip, limit } = query

            const pipeline = []

            if (status) {
                pipeline.push({
                    $match: {
                        status: status
                    }
                })
            }

            pipeline.push(

                {
                    $lookup: {
                        from: "workspaces",
                        let: {
                            workspaceId: {
                                $toObjectId: "$workspaceId"
                            }
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: [
                                            "$_id",
                                            "$$workspaceId"
                                        ]
                                    }
                                }
                            },
                            {
                                $project: {
                                    _id: 0,
                                    name: 1
                                }
                            }
                        ],
                        as: "workspaceName"
                    }
                },
                {
                    $unwind: {
                        path: "$workspaceName",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $project: {
                        _id: 1,
                        workspaceName: "$workspaceName.name",
                        transactionRef: 1,
                        invoiceNumber: 1,
                        customerEmail: 1,
                        amount: 1,
                        currency: 1,
                        paymentMethod: 1,
                        last4: 1,
                        status: 1,
                        planType: 1,
                        createdAt: 1,
                        invoicePdfUrl: 1,
                    }
                }
            )

            if (search) {
                pipeline.push({
                    $match: {
                        $or: [
                            {
                                workspaceName: {
                                    $regex: search,
                                    $options: "i"
                                }
                            },
                            {
                                customerEmail: {
                                    $regex: search,
                                    $options: "i"
                                }
                            },
                        ]
                    }
                })
            }

            pipeline.push({
                $facet: {
                    data: [
                        {
                            $skip: skip
                        },
                        {
                            $limit: limit
                        }
                    ],
                    totalCount: [
                        {
                            $count: "count"
                        }
                    ]
                }
            })

            const [result] = await this._model.aggregate(pipeline)

            return {
                transactions: result.data,
                totalCount: result.totalCount[0]?.count || 0,
            }


        } catch (error) {
            logError(error, {
                service: "TransactionRepository.getAllTransaction"
            })
            throw error
        }
    }
}