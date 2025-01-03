import crypto from 'node:crypto'

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

export class Movie {
  static async getAllMovies () {
    return movies
  }

  static async getAllMoviesByQuery ({ genre }) {
    if (genre) {
      const filterMovies = movies.filter(
        movie => movie.genres.some(g => g.toLowerCase() === genre.toLowerCase())
      )
      return filterMovies
    }
    return []
  }

  static async getMovieById ({ id }) {
    return movies.find(movie => movie.id === parseInt(id))
  }

  static async postMovie ({ movie }) {
    const newMovie = {
      ...movie,
      id: crypto.randomUUID() // uuid v4
    }

    movies.push(newMovie)

    return newMovie
  }

  static async patchMovieById ({ id, element }) {
    const movieIndex = movies.findIndex(movie => movie.id === parseInt(id))
    if (movieIndex === -1) return undefined

    movies[movieIndex] = {
      ...movies[movieIndex],
      ...element
    }

    return movies[movieIndex]
  }

  static async deleteMovieById ({ id }) {
    const movieIndex = movies.findIndex(m => m.id === parseInt(id))
    if (movieIndex === -1) return undefined

    const deletedMovie = movies.splice(movieIndex, 1)
    return deletedMovie
  }
}
