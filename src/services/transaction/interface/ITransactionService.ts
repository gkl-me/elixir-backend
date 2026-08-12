import {
  ICreateTransactionDto,
  IListAllTransactionsDto,
  IListAllTransactionsResDto,
} from "../../../interfaces/dtos/TransactionDto";

export interface ITransactionService {
  createTransaction(data: ICreateTransactionDto): Promise<void>;
  listAllTransaction(
    data: IListAllTransactionsDto
  ): Promise<IListAllTransactionsResDto>;
}
