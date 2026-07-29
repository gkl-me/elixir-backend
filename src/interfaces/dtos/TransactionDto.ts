import { PlanType } from "../../models/Plan";



export interface ICreateTransactionDto {
    transactionRef: string,
    invoiceNumber: string,
    userId: string,
    workspaceId: string,
    subscriptionId: string,
    customerEmail: string,
    amount: number,
    currency: string,
    status: 'success' | 'failed' | 'pending',
    paymentMethod: string,
    last4: string,
    planType: PlanType,
    stripeInvoiceId: string,
    stripeChargeId: string,
    invoicePdfUrl: string,
}


export interface ITransactionDetails {
    id: string,
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
    createdAt: Date
    invoicePdfUrl: string
}

export interface IListAllTransactionsDto {
    status?: string,
    search?: string,
    page: number,
    limit: number
}


export interface IListAllTransactionsResDto {
    transactions: ITransactionDetails[] | [],
    totalCount: number
}