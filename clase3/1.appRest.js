function initApiRest () {
  const express = require('express') // CommonJS
  const app = express()
  const movies = require('./movies.json')

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

  const PORT = process.env.PORT ?? 8080
  app.listen(PORT, () => {
    console.log('Escuchando en el puerto http://localhost:' + PORT)
  })
}

module.exports = {
  initApiRest
}
