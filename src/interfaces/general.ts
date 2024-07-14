import { type Request } from 'express'


interface BaseInterface{
  
  createdAt?: Date
  updatedAt?: Date
}

interface Core {
  code: string
  name: string
}

type UserContext = {
  userId: string
  name: string
  email?: string
} | null

interface CustomRequest extends Request {
  user?: UserContext | null
}

type LimitQueryFunction = (req: CustomRequest, userContext: UserContext | null | undefined) => void

type PermitMethod = (obj: Record<string, any>, req: CustomRequest, userContext: UserContext | null | undefined) => void

export type {
  Core, CustomRequest, UserContext, LimitQueryFunction, PermitMethod, BaseInterface
}
