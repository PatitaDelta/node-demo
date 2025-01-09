import { Router } from 'express'
import { MoviesController } from '../controllers/movies.js'

export const createMovieRouter = ({ movieModel }) => {
  const moviesRouter = Router()
  const moviesController = new MoviesController({ movieModel })

  moviesRouter.get('/', moviesController.getMovies)
  moviesRouter.get('/:id', moviesController.getMovie)

  moviesRouter.post('/', moviesController.postMovie)
  moviesRouter.patch('/:id', moviesController.patchMovie)

  moviesRouter.delete('/:id', moviesController.deleteMovie)

  return moviesRouter
}
