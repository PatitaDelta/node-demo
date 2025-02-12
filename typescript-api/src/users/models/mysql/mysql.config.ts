import mysql, { Connection } from 'mysql2/promise'

export class MysqlConfig {
  public static async getConnection (): Promise<Connection> {
    return await mysql.createConnection({
      host: 'node-demo-database',
      port: 3306,
      database: 'nodeDemoDB',
      user: 'guillermoll',
      password: '1234'
    })
  }

  public static async closeConnection (connection: Connection): Promise<void> {
    void connection.end()
  }
}
