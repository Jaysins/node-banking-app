import { type Response, type NextFunction, Router } from 'express'
import { type CustomRequest, type LimitQueryFunction, type PermitMethod } from '../interfaces/general'
import { BaseRouter } from '../base/router'
import { accountController, type AccountController } from '../controllers/account'
import logger from '../utils/logger'
import { accountRequestSchema, accountResponseSchema, accountFundRequestSchema, accountTransferRequestSchema } from '../schemas/account'
import { publicPermit, publicQuery } from '../utils/restful'

class AccountRouter extends BaseRouter {
  router: Router
  routePath: string = 'accounts'
  serializers = {
    default: accountRequestSchema,
    fund: accountFundRequestSchema,
    transfer: accountTransferRequestSchema,
    response: accountResponseSchema
  }

  constructor (controller: AccountController, limitQuery?: LimitQueryFunction, permitMethod?: PermitMethod) {
    super(controller, limitQuery, permitMethod)
    this.router = Router()
    this.initializeRoutes()
  }

  doPost = async (req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {
    logger.info('doing post==>>')
    return await accountController.register(req.body, req, req.user ?? {})
  }


  fund = async (req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {
    logger.info('doing fund==>>')
    return await accountController.fund(req.body, req, req.user ?? {})
  }

  transfer = async (req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {
    logger.info('doing transfer==>>')
    return await accountController.transfer(req.body, req, req.user ?? {})
  }

}
const accountRouter = new AccountRouter(accountController, publicQuery, publicPermit).router

export default accountRouter
