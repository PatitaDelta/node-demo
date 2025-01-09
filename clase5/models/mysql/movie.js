/* eslint-disable camelcase */
import mysql from 'mysql2/promise'

const conexion = await mysql.createConnection({
  host: 'node-demo-database',
  port: 3306,
  database: 'nodeDemoDB',
  user: 'guillermoll',
  password: '1234'
})

const queryDataMovie = `
  SELECT 
    BIN_TO_UUID(m.id) as id,
    m.title, 
    GROUP_CONCAT(g.name SEPARATOR ', ') as genres,
    m.release_year, 
    m.duration, 
    m.rating, 
    m.description
  FROM movie m
  INNER JOIN movie_genre mg
    ON mg.movie_id = m.id
  INNER JOIN genre g 
    ON g.id = mg.genre_id
  WHERE m.id = UUID_TO_BIN(?)
  GROUP BY m.id, m.release_year, m.duration, m.rating, m.description
`

export class Movie {
  static async getAllMovies () {
    const [movies] = await conexion.query(`
      SELECT 
        BIN_TO_UUID(m.id) as id,
        m.title, 
        GROUP_CONCAT(g.name SEPARATOR ', ') as genres,
        m.release_year, 
        m.duration, 
        m.rating, 
        m.description
      FROM movie m
      INNER JOIN movie_genre mg
        ON mg.movie_id = m.id
      INNER JOIN genre g 
        ON g.id = mg.genre_id
      GROUP BY m.id, m.release_year, m.duration, m.rating, m.description
    `)

    return movies
  }

  static async getAllMoviesByQuery ({ genre }) {
    // Busca el id del genero
    const [[{ id: idGenre }]] = await conexion.query(`
        SELECT id 
        FROM genre 
        WHERE LOWER(name) = ?;
      `, [genre.toLowerCase()]
    )
    if (idGenre === undefined) return undefined

    // Busca el id de las peliculas con ese genero
    let [moviesId] = await conexion.query(`
      SELECT BIN_TO_UUID(movie_id) as id
      FROM movie_genre
      WHERE genre_id = ?;
    `, [idGenre])

    if (!moviesId) return undefined

    // Muestra los datos de las peliculas con ese genero
    moviesId = moviesId.map((movie) => `${movie.id}`)
    const [movies] = await conexion.query(`
      SELECT 
        BIN_TO_UUID(m.id) as id,
        m.title, 
        GROUP_CONCAT(g.name SEPARATOR ', ') as genres,
        m.release_year, 
        m.duration, 
        m.rating, 
        m.description
      FROM movie m
      INNER JOIN movie_genre mg
        ON mg.movie_id = m.id
      INNER JOIN genre g 
        ON g.id = mg.genre_id
      WHERE BIN_TO_UUID(m.id) IN (?)
      GROUP BY m.id, m.release_year, m.duration, m.rating, m.description
    `, [moviesId])

    return movies
  }

  static async getMovieById ({ id }) {
    const [movie] = await conexion.query(queryDataMovie, [id])

    if (!movie.length === 0) return undefined

    return movie
  }

  static async postMovie ({ movie }) {
    const {
      title,
      release_year,
      duration,
      rating,
      description,
      genres
    } = movie

    const [[{ uuid }]] = await conexion.query('SELECT UUID() as uuid')

    // Crea la pelicula
    // ? Se puede añadir el uuid con las comillas porque es un entorno controlado
    const [createInfoMovie] = await conexion.query(`
        INSERT INTO movie (id, title, release_year, duration, rating, description) 
        VALUES (UUID_TO_BIN("${uuid}"), ?, ?, ?, ?, ?);
      `, [title, release_year, duration, rating, description]
    )

    if (createInfoMovie.length === 0) return undefined

    // Crea la conexion entre la movie y generos
    let [genresId] = await conexion.query('SELECT id FROM genre WHERE name IN (?)', [genres])
    genresId = genresId.map(genres => genres.id)

    if (genresId.length === 0) return undefined

    const values = genresId.map(id => `(UUID_TO_BIN('${uuid}'), '${id}')`).join(', ')

    const [createInfoGenre] = await conexion.query(`
      INSERT INTO movie_genre (movie_id, genre_id) 
      VALUES ${values};
    `)

    if (createInfoGenre.length === 0) return undefined

    // Muestra la pelicula creada
    const [movieCreated] = await conexion.query(queryDataMovie, [uuid])

    if (movieCreated.length === 0) return undefined

    return movieCreated
  }

  static async patchMovieById ({ id, element }) {
    const [result] = await conexion.query(`
        UPDATE movie
        SET ?
        WHERE id = UUID_TO_BIN(?);
      `, [element, id]
    )

    if (result.length === 0) return undefined

    const [moviePatched] = await conexion.query(queryDataMovie, [id])

    if (moviePatched.length === 0) return undefined

    return moviePatched
  }

  static async deleteMovieById ({ id }) {
    // Busca la pelicula antes de borrarla
    const [movieToDelete] = await conexion.query(queryDataMovie, [id])

    if (movieToDelete.length === 0) return undefined

    // Se elimina la relacion con los generos
    const [resultMovieGenre] = await conexion.query(`
      DELETE FROM movie_genre
      WHERE movie_id = UUID_TO_BIN(?);
    `, [id]
    )

    if (resultMovieGenre.length === 0) return undefined

    // Se elimina la pelicula
    const [resultMovie] = await conexion.query(`
        DELETE FROM movie 
        WHERE id = UUID_TO_BIN(?);
      `, [id]
    )

    if (resultMovie.length === 0) return undefined

    return movieToDelete
  }
}
