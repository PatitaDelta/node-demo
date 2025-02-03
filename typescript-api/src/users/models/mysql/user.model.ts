import mysql, { Connection, FieldPacket, QueryResult, ResultSetHeader } from 'mysql2/promise'
import { EditUser, NoSensitiveInfoUser, RegisterUser, User } from '../user.js'

const conexion: Connection = await mysql.createConnection({
  host: 'node-demo-database',
  port: 3306,
  database: 'nodeDemoDB',
  user: 'guillermoll',
  password: '1234'
})

export default class UserModel {
  private static readonly defaultLimit = 100

  public static async getUsers (limit: number = UserModel.defaultLimit): Promise<User[]> {
    const query = 'SELECT BIN_TO_UUID(id) as id, name, email, password, rol FROM user LIMIT ?;'
    const data = await conexion.query(query, [limit])

    return data[0] as unknown as User[]
  }

  public static async getUserById (id: string): Promise<User> {
    const query = 'SELECT BIN_TO_UUID(id) as id, name, email, password, rol FROM user WHERE id = UUID_TO_BIN(?);'
    const [[data]] = await conexion.query(query, [id]) as [ResultSetHeader[], FieldPacket[]]

    return data as unknown as User
  }

  public static async getNoSensitiveInfoUsers (limit: number = UserModel.defaultLimit): Promise<NoSensitiveInfoUser[]> {
    const query = 'SELECT name, email FROM user WHERE LOWER(rol) NOT LIKE \'%admin%\' LIMIT ?;'
    const data = await conexion.query(query, [limit])

    return data[0] as unknown as NoSensitiveInfoUser[]
  }

  // Crear desde 0
  public static async postUser (user: RegisterUser): Promise<User> {
    const { password, email, rol } = user
    const name = email.split('@')[0]
    const [[{ uuid: id }]] = await conexion.query('SELECT UUID() as uuid') as any

    const postQuery = `
      INSERT INTO user (id, name, email, password, rol)
        VALUES (UUID_TO_BIN(?), ?, ?, ?, ?)
    ;`

    await conexion.query(postQuery, [id, name, password, email, rol])

    // ! El siguiente codigo es una forma de hacerlo sin usar la funcion getUserById del UserModel
    // const userPostedQuery = 'SELECT BIN_TO_UUID(id) as id, name, email, password, rol FROM user WHERE id = UUID_TO_BIN(?);'
    // const userPostedData = await conexion.query(userPostedQuery, [uuid])
    // return data[0] as unknown as User

    const userPosted = await this.getUserById(id)
    return userPosted
  }

  // Editar todo el usuario
  public static async putUser (user: User): Promise<QueryResult> {
    const { id, name, password, email, rol } = user

    const putQuery = `
      UPDATE user
      SET name = ?, password = ?, email = ?, rol = ?
      WHERE id = UUID_TO_BIN(?);
    ;`

    const putData = await conexion.query(putQuery, [name, password, email, rol, id])

    return putData[0]
  }

  // Editar solo una propiedad
  public static async patchUser (id: string, user: EditUser): Promise<QueryResult> {
    const [key, value] = Object.entries(user)[0]

    const patchQuery = `
      UPDATE user
      SET ${key} = ?
      WHERE id = UUID_TO_BIN(?);
    `

    const patchData = await conexion.query(patchQuery, [value, id])

    return patchData[0]
  }

  public static async deleteUser (id: string): Promise<QueryResult> {
    const deleteQuery = `
      DELETE FROM user
      WHERE id = UUID_TO_BIN(?)
    ;`
    const userDeleteData = await conexion.query(deleteQuery, [id])

    return userDeleteData[0]
  }
}
