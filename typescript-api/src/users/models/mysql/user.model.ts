import mysql, { Connection } from 'mysql2/promise'
import { NoSensitiveInfoUser, RegisterUser, User } from '../user.js'

const conexion: Connection = await mysql.createConnection({
  host: 'node-demo-database',
  port: 3306,
  database: 'nodeDemoDB',
  user: 'guillermoll',
  password: '1234'
})

export default class UserModel {
  public static async getUsers (): Promise<User[]> {
    const query = 'SELECT BIN_TO_UUID(id) as id, name, email, password, rol FROM user;'
    const data = await conexion.query(query, [])

    return data[0] as unknown as User[]
  }

  public static async getUserById (id: string): Promise<User> {
    const query = 'SELECT BIN_TO_UUID(id) as id, name, email, password, rol FROM user WHERE id = UUID_TO_BIN(?);'
    const data = await conexion.query(query, [id])

    return data[0] as unknown as User
  }

  public static async getNoSensitiveInfoUsers (): Promise<NoSensitiveInfoUser[]> {
    const query = 'SELECT name, email FROM user WHERE LOWER(rol) NOT LIKE \'%admin%\';'
    const data = await conexion.query(query, [])

    return data[0] as unknown as NoSensitiveInfoUser[]
  }

  public static async postUser (user: RegisterUser): Promise<User> {
    const { password, email, rol } = user
    const name = email.split('@')[0]
    const [[{ uuid }]] = await conexion.query('SELECT UUID() as uuid') as any
    console.log(uuid)

    const postQuery = `
      INSERT INTO user (id, name, email, password, rol)
        VALUES (UUID_TO_BIN(?), ?, ?, ?, ?)
    ;`

    await conexion.query(postQuery, [uuid, name, password, email, rol])

    const userPostedQuery = 'SELECT BIN_TO_UUID(id) as id, name, email, password, rol FROM user WHERE id = UUID_TO_BIN(?);'
    const userPostedData = await conexion.query(userPostedQuery, [uuid])

    return userPostedData[0] as unknown as User
  }

  public static async deleteUser (id: string): Promise<NoSensitiveInfoUser> {
    const userToDeleteQuery = 'SELECT name, email FROM user WHERE id = UUID_TO_BIN(?);'
    const userToDeleteData = await conexion.query(userToDeleteQuery, [id])

    const deleteQuery = `
      DELETE FROM user
      WHERE id = UUID_TO_BIN(?)
    ;`
    const deleteQueryData = await conexion.query(deleteQuery, [id])
    console.log(deleteQueryData)

    return userToDeleteData[0] as unknown as NoSensitiveInfoUser
  }
}
