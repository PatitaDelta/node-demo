import express from 'express'
import cors from 'cors'
import createHomeRouter from './src/home/home.routes'
import createUserRouter from './src/users/user.router'
import createAuthRouter from './src/users/auth/auth.router'
import { Server } from 'http'

export const app = express()

export default function initApiRest (PORT = process.env.PORT ?? 8080): Server {
  const authRouter = createAuthRouter()
  const homeRouter = createHomeRouter()
  const userRouter = createUserRouter()

  app.disable('x-powered-by')
  app.use(express.json())
  app.use(cors())

  app.use('/', authRouter)
  app.use('/home', homeRouter)
  app.use('/users', userRouter)

  return app.listen(PORT, () => {
    console.log(`Listening in the port ${PORT}`)
  })
}
