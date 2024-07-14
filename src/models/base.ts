import { Schema } from 'mongoose'
import { convertToTruth } from '../utils/helper'

// Create a base schema with common configurations
export const baseSchema = new Schema({
  // Common fields and configurations
}, { timestamps: true })

// Set the toJSON option to include the id field
baseSchema.set('toJSON', {
  transform: function (doc, ret) {
    console.log('in toJSON')
    if (convertToTruth(ret) && convertToTruth(ret._id)) {
      ret.pk = ret._id
      ret._id = ret._id.toString()
      ret.id = ret._id
    }
    delete ret.__v
  }
})

baseSchema.set('toObject', {
  transform: function (doc, ret) {
    console.log('in toObject')
    if (convertToTruth(ret) && convertToTruth(ret._id)) {
      ret.pk = ret._id
      ret._id = ret._id.toString()
      ret.id = ret._id
    }
    delete ret.__v
  }
})

export const coreEmbeddedSchema = new Schema({
  code: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  }
})
