import { type Request } from 'express'
import { type Document } from 'mongoose'
import { type BaseService } from './service'

export class BaseController<T extends Document> {
  constructor (protected readonly service: BaseService<T>) {
  }

  async create (data: any, req: Request, userContext: any): Promise<{ result: Document }> {
    return await this.service.create(data)
  }

  async get (params: any, req: Request, userContext: any): Promise<any> {
    return await this.service.get(params)
  }

  async findById (id: string, req: Request, userContext: any): Promise<T> {
    return await this.service.findById(id)
  }

  async findOne (id: string, req: Request, userContext: any): Promise<T | null> {
    return await this.service.findOne(id)
  }

  async find (id: string, req: Request, userContext: any): Promise<T[]> {
    return await this.service.find(id)
  }

  async update (id: string, data: any, req: Request, userContext: any): Promise<T> {
    return await this.service.update(id, data)
  }

  async delete (id: string, req: Request, userContext: any): Promise<{ status: string }> {
    return await this.service.delete(id)
  }
}
