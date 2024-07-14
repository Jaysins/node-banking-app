import { type Request, type Response, type NextFunction, Router } from 'express'
import { BaseRouter } from '../base/router'
import { loginSchema, signupSchema, userResponseSchema } from '../schemas/auth'
import { userController, type UserController } from '../controllers/user'
import logger from '../utils/logger'

class AuthRouter extends BaseRouter {
  router: Router
  routePath = 'auth'
  serializers = {
    default: signupSchema,
    login: loginSchema,
    response: userResponseSchema
  }

  constructor (controller: UserController) {
    super(controller)
    this.router = Router()
    this.initializeRoutes()
  }

  initializeRoutes (): void {
    this.router.post('/signup', (req: Request, res: Response, next: NextFunction) => {
      this.processFunction(req, res, next)
    })
    this.router.post('/login', (req: Request, res: Response, next: NextFunction) => {
      this.processFunction(req, res, next)
    })
  }

  signup = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    logger.info('signing up==>')
    return await userController.signup(req.body, req, {})
  }

  login = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    logger.info('got here===>', req.body)
    return await userController.login(req.body, req, {})
  }
}

const authRouter = new AuthRouter(userController).router

export default authRouter
