import { BaseInterface } from "./general"
import { User } from "./user"




export interface Account extends BaseInterface {
    accountNumber: string
    accountType: 'checking' | 'savings' | 'investment'
    balance: number
    currency: string
    user?: User
    status: 'active' | 'closed' | 'suspended'
    transactions: string[]
  }
  