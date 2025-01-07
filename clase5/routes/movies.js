import { Router } from 'express'
import { MoviesController } from '../controllers/movies.js'

export const moviesRouter = Router()

moviesRouter.get('/', MoviesController.getMovies)
moviesRouter.get('/:id', MoviesController.getMovie)

moviesRouter.post('/', MoviesController.postMovie)
moviesRouter.patch('/:id', MoviesController.patchMovie)

moviesRouter.delete('/:id', MoviesController.deleteMovie)
