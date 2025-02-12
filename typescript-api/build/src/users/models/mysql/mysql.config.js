import mysql from 'mysql2/promise';
export class MysqlConfig {
    static async getConnection() {
        return await mysql.createConnection({
            host: 'node-demo-database',
            port: 3306,
            database: 'nodeDemoDB',
            user: 'guillermoll',
            password: '1234'
        });
    }
    static async closeConnection(connection) {
        void connection.end();
    }
}
