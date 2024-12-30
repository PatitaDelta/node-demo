function initApiRest () {
  const express = require('express') // CommonJS
  const crypto = require('node:crypto') // CommonJS
  // const cors = require('cors') // CommonJS
  const { validateMovie, validatePartialMovie } = require('./schemas/movies') // CommonJS

  const app = express()
  const movies = require('./movies.json') // ? BD provisional

  app.use(express.json()) // Middleware - Transforma los cuerpos de las petciones a json
  app.disable('x-powered-by') // Desabilita la cabecera de X-Powered-By: Express

  // ! Middleware - Controla el CORS
  const ACCEPTED_ORIGINS = [
    'http://localhost:8080',
    'http://localhost:41913',
    'http://test.com',
    'http://guillermoll.es'
  ]
  // app.use(cors({
  //   // Para el problema de CORS hay que poner la cabecera Access-Control-Allow-Origin
  //   // y poniendo como valor la url que esta atacando al server
  //   origin: (origin, callback) => {
  //     // Si esta en la lista -> permitido
  //     if (ACCEPTED_ORIGINS.includes(origin)) return callback(null, true)
  //     // Si es el mismo -> permitido
  //     if (!origin) return callback(null, true)

  //     return callback(new Error('Not allowed by CORS'))
  //   }
  // }
  // ))

  // !  Middleware - My cors configuration
  app.use('/', (req, res, next) => {
    const origin = req.header('origin')
    if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
      res.header('Access-Control-Allow-Origin', origin)
      res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
    }
    next()
  })

  // ? Por si no quieres que en todas la peticiones se mande el CORS
  // ? El option se usa para 'PUT, PATCH, DELETE'
  // app.options('/movies', (req, res) => {
  //   const origin = req.header('origin')
  //   if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
  //     res.header('Access-Control-Allow-Origin', origin)
  //     res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
  //   }
  //   res.send(200)
  // })

  app.get('/', (req, res) => {
    res.send('<h1>Hola</h1>')
  })

  // Todos los recursos que sean MOVIES se identifican con /movies
  app.get('/movies', (req, res) => {
    // ! CORS Otra forma de confugar el CORS pero para un solo endpoint
    // res.header('Access-Control-Allow-Origin', 'http://localhost:41913')
    const { genre } = req.query
    if (genre) {
      const filterMovies = movies.filter(
        movie => movie.genres.some(g => g.toLowerCase() === genre.toLowerCase())
      )
      return res.json(filterMovies)
    }
    res.json(movies)
  })

  app.get('/movies/:id', (req, res) => { // path-to-regex
    const { id } = req.params
    const movie = movies.find(movie => movie.id === +id)
    if (movie) return res.json(movie)
    res.status(404).json({ message: 'Movie not found' })
  })

  app.post('/movies', (req, res) => {
    // ? Validacion de datos
    const result = validateMovie(req.body)

    if (result.error) {
      return res.status(422).json({ error: JSON.parse(result.error.message) })
    }

    // ? Creacion de los datos en BD
    const newMovie = {
      id: crypto.randomUUID(), // uuid v4
      ...result.data
    }

    // No seria rest porque estamos guardando
    // el estado de la app en memoria
    movies.push(newMovie)

    // ? Envio respuesta
    res.status(201).json(newMovie)
  })

  app.patch('/movies/:id', (req, res) => {
    // ? Validacion de datos de entrada
    const result = validatePartialMovie(req.body)
    if (result.error) return res.status(400).json({ message: JSON.parse(result.error.message) })

    // ? Recoleccion de datos
    const { id } = req.params
    const movieIndex = movies.findIndex(m => m.id.toString() === id)

    // ? Validacion de modificacion
    if (movieIndex === -1) return res.status(404).json({ message: 'Movie not found' })

    // ? Modificacion de los datos en BD
    const updatedMovie = {
      ...movies[movieIndex],
      ...result.data
    }

    movies[movieIndex] = updatedMovie

    // ? Envio respuesta
    res.json(updatedMovie)
  })

  app.delete('/movies/:id', (req, res) => {
    // ! CORS Otra forma de confugar el CORS pero para un solo endpoint
    // res.header('Access-Control-Allow-Origin', 'http://localhost:41913')
    // res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
    // ? Recoleccion de datos de entrada
    const { id } = req.params

    // ? Validacion de datos de entrada
    const movieIndex = movies.findIndex(m => m.id.toString() === id)
    if (movieIndex === -1) return res.status(404).json({ message: 'Movie not found' })

    // ? Modificacion de los datos en BD
    const moviesFiltered = movies.filter(m => m.id.toString() !== id)

    // ? Envio respuesta
    res.json(moviesFiltered)
  })

  const PORT = process.env.PORT ?? 8080
  app.listen(PORT, () => {
    console.log('Escuchando en el puerto http://localhost:' + PORT)
  })
}

module.exports = {
  initApiRest
}
