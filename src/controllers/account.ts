import { type AccountDocument } from '../models/account'
import { accountService, type AccountService } from '../services/account'
import { BaseController } from '../base/controller'
import { type Request } from 'express'
import { BadRequestError } from '../errors'

export class AccountController extends BaseController<AccountDocument> {
  constructor (protected readonly service: AccountService<AccountDocument>) {
    super(service)
  }

  async register (data: any, req: Request, userContext: Record<string, any>): Promise<{ result: AccountDocument, extraFields: Record<string, any> }> {
    data.user = userContext.userId
    const existingAccount = await this.service.findOne({user: data.user, accountType: data.accountType})
    if (existingAccount){
      return { result: existingAccount, extraFields: {}}
    }
    
    return await this.service.register(data)
  }

  async fund (data: any, req: Request, userContext: Record<string, any>): Promise<{ result: AccountDocument, extraFields: Record<string, any> }> {
    data.account = await this.service.findById(req.params.id)
    return await this.service.fund(data)
  }

  async transfer (data: any, req: Request, userContext: Record<string, any>): Promise<{ result: AccountDocument, extraFields: Record<string, any> }> {
    data.account = await this.service.findById(req.params.id)

    if (data.amount > data.account.balance){
        throw new BadRequestError("Insufficient funds")
        }
    const toAccount = await this.service.findOne({accountNumber: data.accountNumber})

    if (!toAccount){
        throw new BadRequestError("Invalid account number")
        }
    data.toAccount = toAccount

    return await this.service.transfer(data)
  }

}

export const accountController = new AccountController(accountService)
