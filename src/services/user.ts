import { type Model } from 'mongoose'
import { BaseService } from '../base/service'
import { type UserDocument, UserModel } from '../models/user'

export class UserService<T extends UserDocument> extends BaseService<T> {
  constructor (protected readonly Model: Model<T>) {
    super(Model)
  }

  async signup (data: Partial<T>): Promise<{ result: T, extraFields: Record<string, any> }> {
    const user = new this.Model(data)
    await user.save()
    return { result: user, extraFields: { token: user.createJWT() } }
  }

  async login (user: T): Promise<{ result: T, extraFields: Record<string, any> }> {
    return { result: user, extraFields: { token: user.createJWT() } }
  }

  async findByEmail (email: string): Promise<{ result: T | null, extraFields: Record<string, any> }> {
    return { result: await this.Model.findOne({ $or: [{ email }, { phoneNumber: email }] }).exec(), extraFields: {} }
  }
}

export const userService = new UserService(UserModel)
