import { type NextFunction, type Response } from 'express'

import jwt, { type JwtPayload } from 'jsonwebtoken'
import { BadRequestError, UnAuthenticatedError } from '../errors'
import { convertToTruth } from '../utils/helper'
import { type CustomRequest } from '../interfaces/general'
import config from '../configs'

export const authMiddleware = (ignoredRoutes: string[]) => {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    console.log('in here==')
    const baseEndpoint = config.server.base_path
    const basePath = req.path.slice(baseEndpoint.length)
    const routeParts = basePath.split('/').filter(Boolean) // Filter out empty strings
    if (routeParts.length < 2) {
      throw new BadRequestError('Invalid request URL')
    }
    const currentRoute = routeParts[1]
    if (ignoredRoutes.includes(currentRoute)) {
      req.user = null
      next()
      return
    }
    const token = req.header('Authorization')
    if (!convertToTruth(token) || token === undefined) {
      throw new UnAuthenticatedError('Auth token required')
    }
    try {
      const decoded: string | JwtPayload = jwt.verify(token, config.jwtSecret)
      if (!convertToTruth(decoded) || typeof decoded === 'string') {
        next(new UnAuthenticatedError('invalid token'))
        return
      }
      req.user = {
        userId: decoded.userId,
        name: decoded.name,
        email: decoded.name
      }
      next()
    } catch (err) {
      throw new UnAuthenticatedError('invalid token')
    }
  }
}

export default authMiddleware
