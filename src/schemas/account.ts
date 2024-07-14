import Joi from 'joi';
import { baseSchema } from '../base/schema';
import { userResponseSchema } from './auth';


const accountRequestSchema = baseSchema.keys({
    accountType: Joi.string().valid('checking', 'savings', 'investment').required(),
});

const accountFundRequestSchema = baseSchema.keys({
  amount: Joi.number().required(),
});

const accountTransferRequestSchema = baseSchema.keys({
  amount: Joi.number().required(),
  accountNumber: Joi.string().required()
});


const accountResponseSchema = baseSchema.keys({
    id: Joi.string().trim().required(),
    accountNumber: Joi.string().trim().required(),
    accountType: Joi.string().valid('checking', 'savings', 'investment').required(),
    balance: Joi.number().required(),
    currency: Joi.string().trim().required(),
    status: Joi.string().valid('active', 'closed', 'suspended').required(),
    createdAt: Joi.date().iso().required(),
    updatedAt: Joi.date().iso().required()
  });

  
export { accountRequestSchema, accountResponseSchema, accountFundRequestSchema, accountTransferRequestSchema };
