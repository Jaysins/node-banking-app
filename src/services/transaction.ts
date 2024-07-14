import { type Model } from 'mongoose'
import { BaseService } from '../base/service'
import { type TransactionDocument, TransactionModel } from '../models/transaction'


export class TransactionService<T extends TransactionDocument> extends BaseService<T> {
  constructor (protected readonly Model: Model<T>) {
    super(Model)
  }

}

export const transactionService = new TransactionService(TransactionModel)
