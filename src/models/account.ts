import mongoose, { Schema, type Document, type Model } from 'mongoose'
import { baseSchema } from './base'
import { type Account as AccountInterface } from '../interfaces/account'
import { AccountStatus, AccountType } from '../enums/general'

// Define the Mongoose schema for the Account model
const accountSchema = new Schema<AccountDocument>({
  accountNumber: {
    type: String,
    required: true,
    unique: true
  },
  accountType: {
    type: String,
    enum: Object.values(AccountType),
    default: AccountType.Checking,
    required: true
  },
  balance: {
    type: Number,
    default: 0,
    required: true
  },
  currency: {
    type: String,
    default: 'NGN',
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: Object.values(AccountStatus),
    default: AccountStatus.Active,
    required: true
  },
  transactions: [{
    type: Schema.Types.ObjectId,
    ref: 'Transaction'
  }]
})

accountSchema.add(baseSchema)

// Define the AccountDocument interface
export interface AccountDocument extends AccountInterface, Document {}

// Export the AccountModel
export const AccountModel: Model<AccountDocument> = mongoose.model<AccountDocument>('Account', accountSchema)
