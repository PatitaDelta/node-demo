import mysql from 'mysql2/promise';
const conexion = await mysql.createConnection({
    host: 'node-demo-database',
    port: 3306,
    database: 'nodeDemoDB',
    user: 'guillermoll',
    password: '1234'
});
export class UserModel {
    static async getUsers() {
        const query = 'SELECT BIN_TO_UUID(id) as id, name, email, password, rol FROM user;';
        const data = await conexion.query(query, []);
        return data[0];
    }
    static async getUserById(id) {
        const query = 'SELECT BIN_TO_UUID(id) as id, name, email, password, rol FROM user WHERE id = UUID_TO_BIN(?);';
        const data = await conexion.query(query, [id]);
        return data[0];
    }
    static async getNoSensitiveInfoUsers() {
        const query = 'SELECT BIN_TO_UUID(id) as id, name, email FROM user WHERE LOWER(name) NOT LIKE \'%admin%\';';
        const data = await conexion.query(query, []);
        return data[0];
    }
}
