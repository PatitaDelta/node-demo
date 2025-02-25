import { FieldPacket, QueryResult, ResultSetHeader } from 'mysql2/promise'
import { EditUser, NoSensitiveInfoUser, RegisterUser, User } from '../user'
import { MysqlConfig } from './mysql.config'

export default class UserModel {
  private static readonly defaultLimit = 100

  public static async getUsers (limit: number = UserModel.defaultLimit): Promise<User[]> {
    const connection = await MysqlConfig.getConnection()

    const query = 'SELECT BIN_TO_UUID(id) as id, name, email, password, rol FROM user LIMIT ?;'
    const data = await connection.query(query, [limit])

    await MysqlConfig.closeConnection(connection)

    return data[0] as unknown as User[]
  }

  public static async getUserByEmail (email: string): Promise<User> {
    const connection = await MysqlConfig.getConnection()

    const query = 'SELECT BIN_TO_UUID(id) as id, name, email, password, rol FROM user WHERE email = ?;'
    const [[data]] = await connection.query(query, [email]) as [ResultSetHeader[], FieldPacket[]]

    await MysqlConfig.closeConnection(connection)

    return data as unknown as User
  }

  public static async getUserById (id: string): Promise<User> {
    const connection = await MysqlConfig.getConnection()

    const query = 'SELECT BIN_TO_UUID(id) as id, name, email, password, rol FROM user WHERE id = UUID_TO_BIN(?);'
    const [[data]] = await connection.query(query, [id]) as [ResultSetHeader[], FieldPacket[]]

    await MysqlConfig.closeConnection(connection)

    return data as unknown as User
  }

  public static async getNoSensitiveInfoUsers (limit: number = UserModel.defaultLimit): Promise<NoSensitiveInfoUser[]> {
    const connection = await MysqlConfig.getConnection()

    const query = 'SELECT name, email FROM user WHERE LOWER(rol) NOT LIKE \'%admin%\' LIMIT ?;'
    const data = await connection.query(query, [limit])

    await MysqlConfig.closeConnection(connection)

    return data[0] as unknown as NoSensitiveInfoUser[]
  }

  // Crear desde 0
  public static async postUser (user: RegisterUser): Promise<User> {
    const connection = await MysqlConfig.getConnection()

    const { password, email, rol } = user
    const name = email.split('@')[0]
    const [[{ uuid: id }]] = await connection.query('SELECT UUID() as uuid') as any

    const postQuery = `
      INSERT INTO user (id, name, email, password, rol)
        VALUES (UUID_TO_BIN(?), ?, ?, ?, ?)
    ;`

    await connection.query(postQuery, [id, name, email, password, rol])

    // ! El siguiente codigo es una forma de hacerlo sin usar la funcion getUserById del UserModel
    // const userPostedQuery = 'SELECT BIN_TO_UUID(id) as id, name, email, password, rol FROM user WHERE id = UUID_TO_BIN(?);'
    // const userPostedData = await connection.query(userPostedQuery, [uuid])
    // return data[0] as unknown as User

    const userPosted = await this.getUserById(id)

    await MysqlConfig.closeConnection(connection)

    return userPosted
  }

  // Editar todo el usuario
  public static async putUser (user: User): Promise<QueryResult> {
    const connection = await MysqlConfig.getConnection()

    const { id, name, password, email, rol } = user

    const putQuery = `
      UPDATE user
      SET name = ?, password = ?, email = ?, rol = ?
      WHERE id = UUID_TO_BIN(?);
    ;`

    const putData = await connection.query(putQuery, [name, password, email, rol, id])

    await MysqlConfig.closeConnection(connection)

    return putData[0]
  }

  // Editar solo una propiedad
  public static async patchUser (id: string, user: EditUser): Promise<QueryResult> {
    const connection = await MysqlConfig.getConnection()

    const [key, value] = Object.entries(user)[0]

    const patchQuery = `
      UPDATE user
      SET ${key} = ?
      WHERE id = UUID_TO_BIN(?);
    `

    const patchData = await connection.query(patchQuery, [value, id])
    await MysqlConfig.closeConnection(connection)

    return patchData[0]
  }

  public static async deleteUser (id: string): Promise<QueryResult> {
    const connection = await MysqlConfig.getConnection()

    const deleteQuery = `
      DELETE FROM user
      WHERE id = UUID_TO_BIN(?)
    ;`
    const userDeleteData = await connection.query(deleteQuery, [id])

    await MysqlConfig.closeConnection(connection)

    return userDeleteData[0]
  }
}
