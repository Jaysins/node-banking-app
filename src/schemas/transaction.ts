import Joi from 'joi';
import { baseSchema } from '../base/schema';
import { userResponseSchema } from './auth';


const transactionResponseSchema = baseSchema.keys({
    amount: Joi.number(),
    type: Joi.string(),
    status: Joi.string(),
    description: Joi.string(),
    createdAt: Joi.date().iso().required(),
    updatedAt: Joi.date().iso().required()
  });

  
export { transactionResponseSchema };
