import { type UserDocument } from '../models/user'
import { userService, type UserService } from '../services/user'
import { BaseController } from '../base/controller'
import type { Request } from 'express'
import { convertToTruth } from '../utils/helper'
import { ValidationError } from '../errors'

export class UserController extends BaseController<UserDocument> {
  constructor (protected readonly service: UserService<UserDocument>) {
    super(service)
  }

  async signup (data: any, req: Request, userContext: any): Promise<any> {
    const { phoneNumber, email } = data
    const exist = await this.service.findOne({ phoneNumber, email })
    if (convertToTruth(exist)) {
      throw new ValidationError('phone number or email already exists')
    }
    return await this.service.signup(data)
  }

  async login (data: any, req: Request, userContext: any): Promise<any> {
    const { email, password } = data
    const { result: user } = await this.service.findByEmail(email)
    if (!convertToTruth(user) || user === null) {
      throw new ValidationError('username does not exist')
    }
    const passwordMatch = await user.comparePassword(password)
    if (!passwordMatch) {
      throw new ValidationError('invalid password')
    }
    return await this.service.login(user)
  }
}

export const userController = new UserController(userService)
