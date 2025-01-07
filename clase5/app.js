import express from 'express' // ESModules
import { moviesRouter } from './routes/movies.js'
import { corsMiddleware } from './middleware/cors.js'

export function initApiRest () {
  const app = express()

  app.use(express.json()) // Middleware - Transforma los cuerpos de las petciones a json
  app.disable('x-powered-by') // Desabilita la cabecera de X-Powered-By: Express
  app.use(corsMiddleware())

  app.get('/', (req, res) => {
    res.send('<h1>Hola</h1>')
  })

  app.use('/movies', moviesRouter)

  const PORT = process.env.PORT ?? 8080
  app.listen(PORT, () => {
    console.log('Escuchando en el puerto http://localhost:' + PORT)
  })
}
