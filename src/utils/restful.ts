import { type CustomRequest, type UserContext } from '../interfaces/general'

export function publicQuery (req: CustomRequest, user: UserContext | undefined): void {
  console.log('applying no filters==>')
}

export function publicPermit (obj: Record<any, string>, req: CustomRequest, userContext: UserContext | undefined): void {
  console.log('applying no permit')
}
