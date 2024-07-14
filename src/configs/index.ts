import dotenv from 'dotenv'

dotenv.config() // Load environment variables from .env file

const config = {
  server: {
    port: process.env.PORT ?? 3000,
    base_path: process.env.BASE_PATH ?? ''
  },

  // Database configuration (if you're using one)
  database: {
    url: process.env.DATABASE_URL ?? 'mongodb://localhost:27017/handyman' // Example MongoDB URL
  },

  // JWT (JSON Web Token) secret for authentication
  jwtSecret: process.env.JWT_SECRET ?? 'the-local-jwt-secret-key',
  jwtLifeTime: process.env.JW ?? '1d'
}

export default config
