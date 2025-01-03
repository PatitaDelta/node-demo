import { Router } from 'express'
import crypto from 'node:crypto'
import { validateMovie, validatePartialMovie } from '../schemas/movies.js'

// ! BD provisional
// ? Como leer un json en ESModules en el futuro
// import { createRequire } from 'node:module' with { type: "json" }

// ? Como leer un json en ESModules de forma recomendada
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const movies = require('../movies.json')

// ? Como leer un json en ESModules de forma entendible pero bloqueando
// import fs from 'node:fs'
// const movies = JSON.parse(fs.readFileSync('./movies.json', 'utf-8'))

export const moviesRouter = Router()

// Todos los recursos que sean MOVIES se identifican con /movies
moviesRouter.get('/', (req, res) => {
  // ? CORS Otra forma de confugar el CORS pero para un solo endpoint
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

moviesRouter.get('/:id', (req, res) => { // path-to-regex
  const { id } = req.params
  const movie = movies.find(movie => movie.id === +id)
  if (movie) return res.json(movie)
  res.status(404).json({ message: 'Movie not found' })
})

moviesRouter.post('/', (req, res) => {
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
  // el estado de la router en memoria
  movies.push(newMovie)

  // ? Envio respuesta
  res.status(201).json(newMovie)
})

moviesRouter.patch('/:id', (req, res) => {
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

moviesRouter.delete('/:id', (req, res) => {
  // ? CORS Otra forma de confugar el CORS pero para un solo endpoint
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
