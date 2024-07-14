import { type Model } from 'mongoose'
import { BaseService } from '../base/service'
import { type ProviderDocument, ProviderModel } from '../models/provider'

export class ProviderService<T extends ProviderDocument> extends BaseService<T> {
  constructor (protected readonly Model: Model<T>) {
    super(Model)
  }
}

export const providerService = new ProviderService(ProviderModel)
