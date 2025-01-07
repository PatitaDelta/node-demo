/* eslint-disable camelcase */
import mysql from 'mysql2/promise'

const conexion = await mysql.createConnection({
  host: 'node-demo-database',
  port: 3306,
  database: 'nodeDemoDB',
  user: 'guillermoll',
  password: '1234'
})

export class Movie {
  static async getAllMovies () {
    const [movies] = await conexion.query(`
        SELECT BIN_TO_UUID(id) as id, title, release_year, duration, rating, description 
        FROM movie
      `, []
    )

    return movies
  }

  static async getAllMoviesByQuery ({ genre }) {
    const [{ id }] = await conexion.query(`
        SELECT id 
        FROM genre 
        WHERE LOWER(name) = ?;
      `, [genre.toLowerCase()]
    )
    // TODO el id simpre me sale undefined
    console.log(id)

    if (!id) return undefined

    const [movies] = await conexion.query(`
        SELECT BIN_TO_UUID(id) as id, title, release_year, duration, rating, description 
        FROM movie 
        INNER JOIN movie_genre 
        ON movie_genre.genre_id = ?;
      `, [id]
    )

    if (movies.length === 0) return undefined

    return movies
  }

  static async getMovieById ({ id }) {
    const [movie] = await conexion.query(`
        SELECT BIN_TO_UUID(id) as id, title, release_year, duration, rating, description 
        FROM movie 
        WHERE id = UUID_TO_BIN(?);
      `, [id]
    )

    if (!movie.length === 0) return undefined

    return movie
  }

  static async postMovie ({ movie }) {
    // TODO los generos

    const {
      title,
      release_year,
      duration,
      rating,
      description
    } = movie

    const [[{ uuid }]] = await conexion.query('SELECT UUID() as uuid')

    // ? Se puede añadir el uuid con las comillas porque es un entorno controlado
    const [createInfo] = await conexion.query(`
        INSERT INTO movie (id, title, release_year, duration, rating, description) 
        VALUES (UUID_TO_BIN("${uuid}"), ?, ?, ?, ?, ?);
      `, [title, release_year, duration, rating, description]
    )

    if (createInfo.length === 0) return undefined

    const [movieCreated] = await conexion.query(`
        SELECT BIN_TO_UUID(id) as id, title, release_year, duration, rating, description 
        FROM movie 
        WHERE id = UUID_TO_BIN(?);
      `, [uuid]
    )

    if (movieCreated.length === 0) return undefined

    return movieCreated
  }

  static async patchMovieById ({ id, element }) {
    const keys = Object.keys(element)
    const values = Object.values(element)

    // TODO los generos
    const [result] = await conexion.query(`
        INSERT INTO movie (?)
        VALUES (?) 
        WHERE id = UUID_TO_BIN(?);
      `, [keys, values, id]
    )

    if (result.length === 0) return undefined

    const [moviePatched] = await conexion.query(`
        SELECT BIN_TO_UUID(id) as id, title, release_year, duration, rating, description 
        FROM movie 
        WHERE id = UUID_TO_BIN(?);
      `, [id]
    )

    if (moviePatched.length === 0) return undefined

    return moviePatched
  }

  static async deleteMovieById ({ id }) {
    // TODO los generos
    const [movieToDelete] = await conexion.query(`
        SELECT BIN_TO_UUID(id) as id, title, release_year, duration, rating, description 
        FROM movie 
        WHERE id = UUID_TO_BIN(?);
      `, [id]
    )

    if (movieToDelete.length === 0) return undefined

    const [result] = await conexion.query(`
        DELETE FROM movie 
        WHERE id = UUID_TO_BIN(?);
      `, [id]
    )

    if (result.length === 0) return undefined

    return movieToDelete
  }
}
