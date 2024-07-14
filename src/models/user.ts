// src/models/user.ts
import { type User as UserInterface } from '../interfaces/user'
import mongoose, { Schema, type Document, type Model } from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { baseSchema } from './base'
import config from '../configs'

// Define the Mongoose schema for the User model
const userSchema = new Schema<UserDocument>({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true,
    unique: true
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true
  },
  suspended: {
    type: Boolean,
    required: false
  },
  category: {
    type: String,
    required: false
  }

})

userSchema.add(baseSchema)

export interface UserDocument extends UserInterface, Document {
  token: string
  createJWT: () => string
  comparePassword: (candidatePassword: string) => Promise<boolean>
}

userSchema.pre<UserDocument>('save', async function (next) {
  if (!this.isModified('password')) {
    next()
    return
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

userSchema.methods.createJWT = function (): string {
  return jwt.sign(
    { userId: this._id, name: this.firstName + ' ' + this.lastName },
    config.jwtSecret,
    {
      expiresIn: config.jwtLifeTime
    }
  )
}

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password)
}

export const UserModel: Model<UserDocument> = mongoose.model<UserDocument>('User', userSchema)
