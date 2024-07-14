import { type Model } from 'mongoose'
import { BaseService } from '../base/service'
import { type AccountDocument, AccountModel } from '../models/account'
import { generateAccountNumber } from '../utils/helper';
import { transactionService } from './transaction';
import { Status, TransactionType } from '../enums/general';


export class AccountService<T extends AccountDocument> extends BaseService<T> {
  constructor (protected readonly Model: Model<T>) {
    super(Model)
  }

  private async generateUniqueAccountNumber(): Promise<string> {
    let accountNumber: string;
    do {
      accountNumber = generateAccountNumber();
    } while (await this.Model.exists({ accountNumber }));

    return accountNumber;
  }

  async register (data: Partial<T>): Promise<{ result: T, extraFields: Record<string, any> }> {
    data.accountNumber = await this.generateUniqueAccountNumber();
    return await this.create(data)
  }

  async fund (data: any): Promise<{ result: T, extraFields: Record<string, any> }> {
    const account = data.account;
    await transactionService.create({ user: account.user, amount: data.amount,
        description: "Account Topup",
      type: TransactionType.Credit, account: account.id, status: Status.Successful })
    
    return {
      result: await this.update(account.id, {balance: data.amount + account.balance}),
      extraFields: {}
    }
  }
  async transfer (data: any): Promise<{ result: T, extraFields: Record<string, any> }> {
    const account = data.account;
    const toAccount = data.toAccount;

    console.log("tooing")
    console.log(toAccount)

    console.log(`Account Transfer to ${toAccount.user.firstName} ${toAccount.user.lastName}`,)
    await transactionService.create({ user: account.user, amount: data.amount,
        description: `Account Transfer to ${toAccount.user.firstName} ${toAccount.user.lastName}`,
      type: TransactionType.Debit, account: account.id, status: Status.Successful })


      await transactionService.create({ user: toAccount.user, amount: data.amount,
        description: `Account Transfer from ${account.user.firstName} ${account.user.lastName}`,
      type: TransactionType.Credit, account: toAccount.id, status: Status.Successful })

    return {
      result: await this.update(account.id, {balance:account.balance - data.amount}),
      extraFields: {}
    }
  }

}

export const accountService = new AccountService(AccountModel)
