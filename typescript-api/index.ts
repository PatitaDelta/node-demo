import express from 'express'
import cors from 'cors'
import createHomeRouter from './src/home/home.routes'
import createUserRouter from './src/users/user.router'

export const app = express()

export default function initApiRest (): void {
  const homeRouter = createHomeRouter()
  const userRouter = createUserRouter()

  app.disable('x-powered-by')
  app.use(express.json())
  app.use(cors())

  app.use('/', homeRouter)
  app.use('/users', userRouter)

  const PORT = process.env.PORT ?? 8080
  app.listen(PORT, () => {
    console.log(`Listening in the port ${PORT}`)
  })
}
