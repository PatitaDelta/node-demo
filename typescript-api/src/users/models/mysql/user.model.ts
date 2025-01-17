import mysql, { Connection, QueryResult } from 'mysql2/promise'
import { NoSensitiveInfoUser, User } from '../user.js'

const conexion: Connection = await mysql.createConnection({
  host: 'node-demo-database',
  port: 3306,
  database: 'nodeDemoDB',
  user: 'guillermoll',
  password: '1234'
})

export class UserModel {
  public static async getUsers (): Promise<User[]> {
    const query = 'SELECT BIN_TO_UUID(id) as id, name, email, password, rol FROM user'
    const data = await conexion.query(query, [])

    return data[0] as unknown as User[]
  }

  public static async getUserById (id: string): Promise<User> {
    const query = 'SELECT BIN_TO_UUID(id) as id, name, email, password, rol FROM user WHERE id = UUID_TO_BIN(?)'
    const data = await conexion.query(query, [id])

    return data[0] as unknown as User
  }

  public static async getNoSensitiveInfoUserById (id: string): Promise<NoSensitiveInfoUser> {
    const query = 'SELECT id, name, email FROM user WHERE id = UUID_TO_BIN(?)'
    return await conexion.query(query, [id]).then()
  }
}
