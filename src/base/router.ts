import { type Response, type NextFunction, Router } from 'express'
import asyncHandler from 'express-async-handler'
import mongoose from 'mongoose'
import logger from '../utils/logger'
import { convertToTruth } from '../utils/helper'
import { BadRequestError, UnAuthenticatedError } from '../errors'
import { type BaseController } from './controller'
import { type CustomRequest, type LimitQueryFunction, type PermitMethod, type UserContext } from '../interfaces/general'

export class BaseRouter {
  router: Router
  serializers: Record<string, any> = {}
  routePath: string = ''
  controller: BaseController<any>
  queryMethod: LimitQueryFunction
  permitMethod: PermitMethod

  constructor (controller: BaseController<any>, limitQuery?: LimitQueryFunction, permitMethod?: PermitMethod) {
    this.router = Router()
    this.controller = controller
    this.queryMethod = limitQuery ?? this.defaultLimitQuery
    this.permitMethod = permitMethod ?? this.defaultPermit
    this.initializeRoutes()
  }

  initializeRoutes (): void {
    this.router.post(`/${this.routePath}/:id?/:resource?`, (req: CustomRequest, res: Response, next: NextFunction) => {
      this.processFunction(req, res, next)
    })
    this.router.get(`/${this.routePath}/:id?`, (req: CustomRequest, res: Response, next: NextFunction) => {
      this.processFunction(req, res, next)
    })
  }

  defaultLimitQuery (req: CustomRequest, userContext: UserContext | undefined): void {
    const currentFilter = (convertToTruth(req.params.filterBy)) ? JSON.parse(req.params.filterBy) : {}
    currentFilter.user = userContext?.userId
    req.params.filterBy = currentFilter
  }

  defaultPermit (obj: Record<any, string>, req: CustomRequest, userContext: UserContext | undefined): void {
    const user = userContext?.userId
    const userKey = convertToTruth(obj.user) ? obj.user : obj.userId
    if (convertToTruth(user) && userKey !== user) {
      throw new UnAuthenticatedError('You do not have permission to access this resource')
    }
  }

  doPost = async (req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {
    logger.info('doing post==>>')
    return await this.controller.create(req.body, req, req.user)
  }

  doUpdate = async (req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {
    logger.info('doing update==>>')
    return await this.controller.update(req.params.id, req.body, req, req.user)
  }

  doGet = async (req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {
    logger.info('doing get==>>')
    const user = req.user ?? null

    if (convertToTruth(req.params.id)) {
      const obj = await this.controller.findById(req.params.id, req, req.user)
      this.permitMethod(obj, req, user)
      return obj
    }
    this.queryMethod(req, user)
    return await this.controller.get(req.query, req, req.user)
  }

  doDelete = async (req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {
    logger.info('doing delete==>>')
    return await this.controller.delete(req.params.id, req, req.user)
  }

  validateRequest (serializerName: string, data: Record<string, any>, next: NextFunction): Record<string, any> {
    let serializer = this.serializers[serializerName]
    serializer = convertToTruth(serializer) ? serializer : this.serializers.default
    const {
      error,
      value
    } = serializer.validate(data)
    if (convertToTruth(error) && error !== undefined) {
      throw new BadRequestError(error.details.map((detail: { message: any }) => detail.message).join(', '))
    }
    return value
  }

  serializeResponse (serializerName: string, data: Record<string, any>, next: NextFunction): Record<string, any> {
    let serializer = this.serializers[`${serializerName}Response`]
    serializer = convertToTruth(serializer) ? serializer : this.serializers.response
    const { extraFields = null } = data

    if (convertToTruth(extraFields)) {
      data = data.result ?? data.results
    }
    console.log(data)
    if (Array.isArray(data)) {
      const validatedDataArray: any[] = []
      data.forEach(obj => {
        obj = obj instanceof mongoose.Model ? obj.toObject() : obj
        const { error, value } = serializer.validate(obj)
        if (convertToTruth(error)) {
          throw new BadRequestError(error.details.map((detail: { message: any }) => detail.message).join(', '))
        } else {
          validatedDataArray.push(value)
        }
      })
      return { results: validatedDataArray, ...extraFields }
    }

    if (data instanceof mongoose.Model) {
      data = data.toObject()
    }

    const { error, value } = serializer.validate(data)
    if (convertToTruth(error) && error !== undefined) {
      throw new BadRequestError(error.details.map((detail: { message: any }) => detail.message).join(', '))
    }
    return { ...value, ...extraFields }
  }

  processFunction = asyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
    const pathElements = req.path.split('/').slice(-1)
    const funcName = pathElements[0]
    console.log(req.query, req.params, "vooom")
    console.log(pathElements, funcName)
    const { id, resource } = req.params
    const idExists = convertToTruth(id)
    const resourceExists = convertToTruth(resource)
    let response
    if (req.method === 'GET') {
      if (funcName === this.routePath) {
        response = await this.doGet(req, res, next)
      } else {
        throw new BadRequestError('cannot perform on Get')
      }
    } else if (req.method === 'DELETE') {
      if (funcName === this.routePath && idExists) {
        response = await this.doDelete(req, res, next)
      } else {
        throw new BadRequestError('cannot perform on Delete')
      }
    } else if (req.method === 'POST') {
      req.body = this.validateRequest(funcName, req.body, next)
      logger.info(`Request body: ${JSON.stringify(req.body)}`)
      if (funcName === this.routePath && !idExists) {
        response = await this.doPost(req, res, next)
      } else if (idExists && !resourceExists) {
        response = await this.doUpdate(req, res, next)
      } else if (idExists && resourceExists) {
        response = await (this as any)[resource](req, res, next)
      } else {
        response = await (this as any)[funcName](req, res, next)
      }
    } else {
      throw new BadRequestError('Method not allowed on this resource')
    }
    logger.info(`Response body: ${JSON.stringify(response)}`)
    const methodStatus: Record<string, number> = {
      POST: 201,
      PUT: 200,
      GET: 201
    }
    res.status(methodStatus[req.method]).json(this.serializeResponse(funcName, response, next))
  })
}
