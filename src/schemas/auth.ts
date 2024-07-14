import { baseSchema } from '../base/schema'
import Joi from 'joi'

const signupSchema = baseSchema.keys({
  email: Joi.string().lowercase().trim().email().required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().trim().min(1).required(),
  lastName: Joi.string().trim().min(1).required(),
  phoneNumber: Joi.string().trim().required()
})

const loginSchema = baseSchema.keys({
  email: Joi.string().trim().lowercase().required(),
  password: Joi.string().trim().min(6).required()
})

const userResponseSchema = baseSchema.keys({
  email: Joi.string().email(),
  phone: Joi.string(),
  phoneNumber: Joi.string().trim(),
  token: Joi.string(),
  firstName: Joi.string(),
  lastName: Joi.string()
})

export { signupSchema, loginSchema, userResponseSchema }
