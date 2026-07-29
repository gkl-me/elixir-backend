import { PlanType } from "../../../models/Plan";
import { ITransaction } from "../../../models/Transaction";
import { IBaseRepository } from "../../base/interface/IBaseRepository";

export interface ITransactionRepository extends IBaseRepository<ITransaction> {

    getAllTransactions(query: IGetAllTransaction): Promise<IGetAllTransactionsRes>
}

export interface IGetAllTransaction {
    search?: string,
    status?: string,
    skip: number,
    limit: number
}


export interface IGetAllTransactionDetails {
    _id: string,
    transactionRef: string
    invoiceNumber: string,
    customerEmail: string,
    workspaceName: string,
    amount: number,
    currency: string,
    paymentMethod: string,
    last4: string,
    status: 'success' | 'failed' | 'pending',
    planType: PlanType,
    createdAt: Date,
    invoicePdfUrl: string
}

export interface IGetAllTransactionsRes {
    transactions: IGetAllTransactionDetails[] | []
    totalCount: number
}