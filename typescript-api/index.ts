import express from 'express'
import cors from 'cors'
import { createHomeRouter } from './src/home/home.routes.js'
import { createCsvRouter } from './src/csv/csv.routes.js'
import { createUserRouter } from './src/users/user.router.js'

export function initApiRest (): void {
  const app = express()
  const homeRouter = createHomeRouter()
  const csvRouter = createCsvRouter()
  const userRouter = createUserRouter()

  app.disable('x-powered-by')
  app.use(express.json())
  app.use(cors())

  app.use('/', homeRouter)
  app.use('/csv', csvRouter)
  app.use('/users', userRouter)

  const PORT = process.env.PORT ?? 8080
  app.listen(PORT, () => {
    console.log(`Listening in the port ${PORT}`)
  })
}
