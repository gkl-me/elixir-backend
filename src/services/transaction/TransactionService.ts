import { inject, injectable } from "tsyringe";
import { ITransactionService } from "./interface/ITransactionService";
import { ICreateTransactionDto, IListAllTransactionsDto, IListAllTransactionsResDto } from "../../interfaces/dtos/TransactionDto";
import { logError } from "../../middlewares/loggerHelper";
import { Token } from "../../di/token";
import { ITransactionRepository } from "../../repositories/transaction/interface/ITransactionRepository";
import { transactionDtoMapper } from "../../interfaces/mapper/transactionDtoMapper";


@injectable()
export class TransactionService implements ITransactionService {

    constructor(
        @inject(Token.TransactionRepository) private readonly _transactionRepository: ITransactionRepository
    ) { }

    async createTransaction(data: ICreateTransactionDto): Promise<void> {
        try {

            await this._transactionRepository.create(data)

        } catch (error) {
            logError(error, {
                service: "TransactionService.createTransaction"
            })
            throw error
        }
    }

    async listAllTransaction(data: IListAllTransactionsDto): Promise<IListAllTransactionsResDto> {
        try {

            const { search, status, page, limit } = data

            const skip = (page - 1) * limit

            const { transactions, totalCount } = await this._transactionRepository.getAllTransactions({
                search,
                status,
                skip,
                limit
            })

            return {
                transactions: transactions.map(txn => transactionDtoMapper.toTransactionList(txn)),
                totalCount
            }

        } catch (error) {
            logError(error, {
                service: "TransactionService.listAllTransaction"
            })
            throw error
        }
    }

}