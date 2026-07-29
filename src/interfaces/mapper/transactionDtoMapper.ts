import { IGetAllTransactionDetails } from "../../repositories/transaction/interface/ITransactionRepository";
import { ITransactionDetails } from "../dtos/TransactionDto";

export class transactionDtoMapper {
  static toTransactionList(
    transaction: IGetAllTransactionDetails
  ): ITransactionDetails {
    return {
      id: String(transaction._id),
      transactionRef: transaction.transactionRef,
      invoiceNumber: transaction.invoiceNumber,
      customerEmail: transaction.customerEmail,
      workspaceName: transaction.workspaceName,
      amount: transaction.amount,
      currency: transaction.currency,
      paymentMethod: transaction.paymentMethod,
      last4: transaction.last4,
      status: transaction.status,
      planType: transaction.planType,
      createdAt: transaction.createdAt,
      invoicePdfUrl: transaction.invoicePdfUrl,
    };
  }
}
