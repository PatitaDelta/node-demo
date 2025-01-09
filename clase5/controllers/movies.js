import { validateMovie, validatePartialMovie } from '../schemas/movies.js'

export class MoviesController {
  constructor ({ movieModel }) {
    this.movie = movieModel
  }

  getMovies = async (request, response) => {
    // ? CORS Otra forma de confugar el CORS pero para un solo endpoint
    // response.header('Access-Control-Allow-Origin', 'http://localhost:41913')
    if (Object.keys(request.query).length) {
      const { genre } = request.query
      const movies = await this.movie.getAllMoviesByQuery({ genre })
      return response.json(movies)
    }

    response.json(await this.movie.getAllMovies())
  }

  getMovie = async (request, response) => {
  // ? Validacion de datos de entrada
    const { id } = request.params

    // ? Creacion en BD
    const movie = await this.movie.getMovieById({ id })

    // ? Envio respuesta
    if (movie) return response.json(movie)
    response.status(404).json({ message: 'Movie not found' })
  }

  postMovie = async (request, response) => {
  // ? Validacion de datos de entrada
    const result = validateMovie(request.body)

    if (result.error) {
      return response.status(422).json({ error: JSON.parse(result.error.message) })
    }

    // ? Creacion en BD
    const newMovie = await this.movie.postMovie({ movie: result.data })

    // ? Envio respuesta
    if (!newMovie) return response.status(500).json({ message: 'Movie could not be created' })
    response.status(201).json(newMovie)
  }

  patchMovie = async (request, response) => {
  // ? Validacion de datos de entrada
    const result = validatePartialMovie(request.body)
    if (result.error) return response.status(400).json({ message: JSON.parse(result.error.message) })

    // ? Modificacion de los datos en BD
    const { id } = request.params
    const updatedMovie = await this.movie.patchMovieById({ id, element: result.data })

    // ? Envio respuesta
    if (!updatedMovie) return response.status(404).json({ message: 'Movie not found' })
    response.json(updatedMovie)
  }

  deleteMovie = async (request, response) => {
  // ? CORS Otra forma de confugar el CORS pero para un solo endpoint
  // res.header('Access-Control-Allow-Origin', 'http://localhost:41913')
  // res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')

    // ? Validacion de datos de entrada
    const { id } = request.params

    // ? Modificacion de los datos en BD
    const deletedMovie = await this.movie.deleteMovieById({ id })

    // ? Envio respuesta
    if (!deletedMovie) return response.status(404).json({ message: 'Movie not found' })
    response.json(deletedMovie)
  }
}
