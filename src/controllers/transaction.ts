import { type TransactionDocument } from '../models/transaction'
import { transactionService, type TransactionService } from '../services/transaction'
import { BaseController } from '../base/controller'

export class TransactionController extends BaseController<TransactionDocument> {
  constructor (protected readonly service: TransactionService<TransactionDocument>) {
    super(service)
  }

}

export const transactionController = new TransactionController(transactionService)
