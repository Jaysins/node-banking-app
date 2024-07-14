import { type Model, type Document } from 'mongoose'
import { convertToTruth } from '../utils/helper'

export class BaseService<T extends Document> {
  constructor (protected readonly Model: Model<T>) {
  }

  protected async populateReferenceFields (item: T): Promise<void> {
    const populatePaths: Array<{ path: string, select: string }> = []

    // Dynamically populate all reference fields
    this.Model.schema.eachPath((path) => {
      const fieldOptions = this.Model.schema.path(path).options
      if (Boolean((fieldOptions)) && Boolean((fieldOptions?.ref))) {
        // Push an object with path and select options to populatePaths array
        populatePaths.push({
          path,
          select: fieldOptions.select
        })
      }
    })

    // Wait for all population to complete
    await item.populate(populatePaths)
  }

  async create (data: Partial<T>): Promise<{ result: T, extraFields: Record<string, any> }> {
    const newItem = new this.Model(data)
    await newItem.save()
    return {
      result: newItem,
      extraFields: {}
    }
  }

  async get (params: Record<string, any> = {}): Promise<Record<string, any>> {
    let {
      filterBy,
      sortBy,
      query,
      pageBy = { page: 1, limit: 10 }
    } = params
    console.log(pageBy, 'ddd', typeof pageBy)

if (typeof pageBy === 'string') {
    pageBy = JSON.parse(pageBy);
}
    const queryObject: Record<string, any> = filterBy
    if (convertToTruth(query)) {
      queryObject.position = {
        $regex: query,
        $options: 'i'
      }
    }
    let queryBuild = this.Model.find(queryObject)

    if (convertToTruth(sortBy) || sortBy === 'latest') {
      queryBuild = queryBuild.sort('-createdAt')
    }
    if (sortBy === 'oldest') {
      queryBuild = queryBuild.sort('createdAt')
    }

    if (sortBy === 'z-a') {
      queryBuild = queryBuild.sort('-position')
    }
    if (sortBy === 'a-z') {
      queryBuild = queryBuild.sort('position')
    }
    console.log(pageBy.page)
    const page = convertToTruth(pageBy.page) ? Number(pageBy.page) : 1
    const limit = convertToTruth(pageBy.limit) ? Number(pageBy.limit) : 10
    const skip = (page - 1) * limit
    console.log("skipping===", skip, limit, page)
    const results = await queryBuild.skip(skip).limit(limit)

    const totalRecords = await this.Model.countDocuments(queryObject)
    const numOfPages = Math.ceil(totalRecords / limit)

    return {
      results,
      extraFields: {
        numOfPages,
        totalRecords,
        query: params
      }
    }
  }

  async findById (id: string): Promise<T> {
    const item = await this.Model.findById(id).exec()
    if (typeof item === 'undefined' || item === null) {
      throw new Error('Unable to fetch resource')
    }
    await this.populateReferenceFields(item)
    return item
  }

  async findOne (data: any): Promise<T | null> {
    const item = await this.Model.findOne(data).exec()
    if (!convertToTruth(item) || item === null) {
      return null
    }
    await this.populateReferenceFields(item)
    return item
  }

  async find (data: any): Promise<T[]> {
    const items = await this.Model.find(data).exec()
    const populatedItems: T[] = []
    for (const item of items) {
      await this.populateReferenceFields(item)
      populatedItems.push(item)
    }
    return populatedItems
  }

  async update (id: string, data: any): Promise<T> {
    const item = await this.Model.findByIdAndUpdate(id, data, { new: true }).exec()
    if (typeof item === 'undefined' || item === null) {
      throw new Error('Unable to update resource')
    }
    await this.populateReferenceFields(item)
    return item
    
  }

  async delete (id: string): Promise<{ status: string }> {
    await this.Model.findByIdAndDelete(id).exec()
    return { status: 'success' }
  }
}
