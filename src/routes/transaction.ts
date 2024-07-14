import { type Response, type NextFunction, Router } from 'express'
import { type CustomRequest, type LimitQueryFunction, type PermitMethod } from '../interfaces/general'
import { BaseRouter } from '../base/router'
import { transactionController, type TransactionController } from '../controllers/transaction'
import logger from '../utils/logger'
import { transactionResponseSchema } from '../schemas/transaction'
import { publicPermit, publicQuery } from '../utils/restful'

class TransactionRouter extends BaseRouter {
  router: Router
  routePath: string = 'transactions'
  serializers = {
    response: transactionResponseSchema
  }

  constructor (controller: TransactionController, limitQuery?: LimitQueryFunction, permitMethod?: PermitMethod) {
    super(controller, limitQuery, permitMethod)
    this.router = Router()
    this.initializeRoutes()
  }

}
const transactionRouter = new TransactionRouter(transactionController, publicQuery, publicPermit).router

export default transactionRouter
