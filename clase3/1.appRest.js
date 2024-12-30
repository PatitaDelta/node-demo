function initApiRest () {
  const express = require('express') // CommonJS
  const crypto = require('node:crypto') // CommonJS
  const { validateMovie } = require('./schemas/movies') // CommonJS

  const app = express()
  const movies = require('./movies.json') // ? BD provisional

  app.use(express.json()) // Middleware - Transforma los cuerpos de las petciones a json
  app.disable('x-powered-by') // Desabilita la cabecera de X-Powered-By: Express

  app.get('/', (req, res) => {
    res.send('<h1>Hola</h1>')
  })

  // Todos los recursos que sean MOVIES se identifican con /movies
  app.get('/movies', (req, res) => {
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
    // Validacion de datos
    const result = validateMovie(req.body)

    if (result.error) {
      return res.status(422).json({ error: JSON.parse(result.error.message) })
    }
    // En BD
    const newMovie = {
      id: crypto.randomUUID(), // uuid v4
      ...result.data
    }

    // No seria rest porque estamos guardando
    // el estado de la app en memoria
    movies.push(newMovie)

    res.status(201).json(newMovie)
  })

  const PORT = process.env.PORT ?? 8080
  app.listen(PORT, () => {
    console.log('Escuchando en el puerto http://localhost:' + PORT)
  })
}

module.exports = {
  initApiRest
}
