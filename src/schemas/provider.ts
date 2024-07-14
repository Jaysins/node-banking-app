import { baseSchema } from '../base/schema'
import Joi from 'joi'

const providerRequestSchema = baseSchema.keys({
  name: Joi.string().trim().required(),
  email: Joi.string().trim().email().lowercase().required(),
  category: Joi.string().trim().lowercase().required()
})

const providerResponseSchema = baseSchema.keys({
  id: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string(),
  phoneNumber: Joi.string().trim(),
  token: Joi.string(),
  firstName: Joi.string(),
  lastName: Joi.string()
})

export { providerRequestSchema, providerResponseSchema }
