import { type ProviderDocument } from '../models/provider'
import { providerService, type ProviderService } from '../services/provider'
import { BaseController } from '../base/controller'
import { type Request } from 'express'

export class ProviderController extends BaseController<ProviderDocument> {
  constructor (protected readonly service: ProviderService<ProviderDocument>) {
    super(service)
  }

  async register (data: any, req: Request, userContext: Record<string, any>): Promise<{ result: ProviderDocument, extraFields: Record<string, any> }> {
    data.user = userContext.userId
    return await this.service.create(data)
  }
}

export const providerController = new ProviderController(providerService)
