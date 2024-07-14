// src/interfaces/user.ts
export interface User {
  firstName: string
  lastName: string
  email: string
  name: string
  password: string
  id?: any
  token: string
  phoneNumber: string
  suspended: boolean
  category?: string
}
