import { type Response, type NextFunction, Router } from 'express'
import { type CustomRequest, type LimitQueryFunction, type PermitMethod } from '../interfaces/general'
import { BaseRouter } from '../base/router'
import { providerController, type ProviderController } from '../controllers/provider'
import logger from '../utils/logger'
import { providerRequestSchema, providerResponseSchema } from '../schemas/provider'
import { publicPermit, publicQuery } from '../utils/restful'

class ProviderRouter extends BaseRouter {
  router: Router
  routePath: string = 'providers'
  serializers = {
    default: providerRequestSchema,
    response: providerResponseSchema
  }

  constructor (controller: ProviderController, limitQuery?: LimitQueryFunction, permitMethod?: PermitMethod) {
    super(controller, limitQuery, permitMethod)
    this.router = Router()
    this.initializeRoutes()
  }

  // initializeRoutes (): void {
  //   super.initializeRoutes()
  //   this.router.post(`/${this.routePath}`, (req: CustomRequest, res: Response, next: NextFunction) => {
  //     this.processFunction(req, res, next)
  //   })
  //   this.router.get(`/${this.routePath}/:id?`, (req: CustomRequest, res: Response, next: NextFunction) => {
  //     this.processFunction(req, res, next)
  //   })
  // }

  register = async (req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {
    logger.info('registering==>>')
    return await providerController.register(req.body, req, req.user ?? {})
  }

  ski = async(req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {
    console.log("skiied")
  }
}
const providerRouter = new ProviderRouter(providerController, publicQuery, publicPermit).router

export default providerRouter
