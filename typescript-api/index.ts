import express from 'express'
import cors from 'cors'

export function initApiRest () {
  const app = express()

  app.use(express.json())
  app.disable('x-powered-by')
  app.use(cors())

  app.get('/ping', (_request, response) => {
    response.send('<h1>pong</h1>')
  })

  const PORT = process.env.PORT ?? 8080
  app.listen(PORT, () => {
    console.log(`Listening in the port ${PORT}`)
  })
}
