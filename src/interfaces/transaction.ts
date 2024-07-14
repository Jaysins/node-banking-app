import { Types } from 'mongoose';
import { Status } from '../enums/general';


export interface TransactionInterface {
    amount: number;
    type: string;
    description: string;
    status: Status;
    account: string;
    user: Types.ObjectId;
    createdAt?: Date
    updatedAt?: Date
  }
  