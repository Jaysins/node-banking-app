import 'express-async-errors'
import express, { type Express, type Request, type Response } from 'express'
import config from './configs'
import cors from 'cors'
import helmet from 'helmet'
import logger from './utils/logger'
import { connectToDatabase } from './utils/db'
import errorHandlerMiddleware from './middlewares/errorHandler'
import authMiddleware from './middlewares/authMiddleware'

import authRouter from './routes/auth'
import providerRouter from './routes/provider'
import accountRouter from './routes/account'
import transactionRouter from './routes/transaction'

const app: Express = express()
const port = config.server.port
const basePath = config.server.base_path

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(helmet())
app.use(authMiddleware(['login', 'signup']))

app.get(`${basePath}/home/intro`, (_req: Request, res: Response) => {
  res.send('Welcome to Handyman API')
})

app.use(`${basePath}/auth`, authRouter)
app.use(`${basePath}/services`, providerRouter)
app.use(`${basePath}/finance`, accountRouter)
app.use(`${basePath}/payments`, transactionRouter)

// Use your custom error handler middleware
app.use(errorHandlerMiddleware)

void connectToDatabase().then(() => {
  app.listen(port, () => {
    logger.info(`⚡️[server]: Server is running at http://localhost:${port}`)
  })
})
