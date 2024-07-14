// src/utils/db.ts
import mongoose from 'mongoose'
import config from '../configs'

// Function to establish the database connection
export async function connectToDatabase (): Promise<void> {
  try {
    await mongoose.connect(config.database.url, {})
    console.log('Connected to MongoDB')
  } catch (error) {
    console.error('MongoDB connection error:', error)
  }
}
