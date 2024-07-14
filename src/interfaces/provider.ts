import { type Core } from './general'

export interface Provider {
  name: string
  email: string
  categories: [Core]
}
