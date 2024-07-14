import mongoose, { Schema, type Document, type Model } from 'mongoose'
import { type Provider as ProviderInterface } from '../interfaces/provider'
import { baseSchema } from './base'

const providerSchema = new Schema({
  name: {
    type: String
  },
  email: {
    type: String
  },
  categories: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Category' }]
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

providerSchema.add(baseSchema)

export interface ProviderDocument extends ProviderInterface, Document {}

export const ProviderModel: Model<ProviderDocument> = mongoose.model<ProviderDocument>('Provider', providerSchema)
