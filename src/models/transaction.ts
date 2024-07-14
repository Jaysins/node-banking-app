import mongoose, { Schema, Document, Model } from 'mongoose';
import { baseSchema } from './base';
import { Status, TransactionType } from '../enums/general'; // Assuming TransactionType is defined in enums/general
import { TransactionInterface } from '../interfaces/transaction';

// Define the Mongoose schema for the Transaction model
const transactionSchema = new Schema({
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: Object.values(TransactionType),
    required: true
  },
  status: {
    type: String,
    enum: Object.values(Status),
    required: true
  },

  description: {
    type: String,
    required: true
  },
  account: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
});

transactionSchema.add(baseSchema); // Assuming baseSchema provides additional fields or methods

// Define the TransactionDocument interface
export interface TransactionDocument extends TransactionInterface, Document {}

// Export the TransactionModel
export const TransactionModel: Model<TransactionDocument> = mongoose.model<TransactionDocument>('Transaction', transactionSchema);
