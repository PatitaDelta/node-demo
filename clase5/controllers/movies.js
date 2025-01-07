// ! Con solo cambiar una linea, a que BD esta atacando
// import { Movie } from '../models/local/movie.js'
import { Movie } from '../models/mysql/movie.js'

import { validateMovie, validatePartialMovie } from '../schemas/movies.js'

export class MoviesController {
  static async getMovies (request, response) {
    // ? CORS Otra forma de confugar el CORS pero para un solo endpoint
    // response.header('Access-Control-Allow-Origin', 'http://localhost:41913')
    if (Object.keys(request.query).length) {
      const { genre } = request.query
      return response.json(await Movie.getAllMoviesByQuery({ genre }))
    }

    response.json(await Movie.getAllMovies())
  }

  static async getMovie (request, response) {
  // ? Validacion de datos de entrada
    const { id } = request.params

    // ? Creacion en BD
    const movie = await Movie.getMovieById({ id })

    // ? Envio respuesta
    if (movie) return response.json(movie)
    response.status(404).json({ message: 'Movie not found' })
  }

  static async postMovie (request, response) {
  // ? Validacion de datos de entrada
    const result = validateMovie(request.body)

    if (result.error) {
      return response.status(422).json({ error: JSON.parse(result.error.message) })
    }

    // ? Creacion en BD
    const newMovie = await Movie.postMovie({ movie: result.data })

    // ? Envio respuesta
    if (!newMovie) return response.status(500).json({ message: 'Movie could not be created' })
    response.status(201).json(newMovie)
  }

  static async patchMovie (request, response) {
  // ? Validacion de datos de entrada
    const result = validatePartialMovie(request.body)
    if (result.error) return response.status(400).json({ message: JSON.parse(result.error.message) })

    // ? Modificacion de los datos en BD
    const { id } = request.params
    const updatedMovie = await Movie.patchMovieById({ id, element: result.data })

    // ? Envio respuesta
    if (!updatedMovie) return response.status(404).json({ message: 'Movie not found' })
    response.json(updatedMovie)
  }

  static async deleteMovie (request, response) {
  // ? CORS Otra forma de confugar el CORS pero para un solo endpoint
  // res.header('Access-Control-Allow-Origin', 'http://localhost:41913')
  // res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')

    // ? Validacion de datos de entrada
    const { id } = request.params

    // ? Modificacion de los datos en BD
    const deletedMovie = await Movie.deleteMovieById({ id })

    // ? Envio respuesta
    if (!deletedMovie) return response.status(404).json({ message: 'Movie not found' })
    response.json(deletedMovie)
  }
}
