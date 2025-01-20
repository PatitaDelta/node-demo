import mysql from 'mysql2/promise';
const conexion = await mysql.createConnection({
    host: 'node-demo-database',
    port: 3306,
    database: 'nodeDemoDB',
    user: 'guillermoll',
    password: '1234'
});
export default class UserModel {
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
        const query = 'SELECT name, email FROM user WHERE LOWER(rol) NOT LIKE \'%admin%\';';
        const data = await conexion.query(query, []);
        return data[0];
    }
    static async postUser(user) {
        const { password, email, rol } = user;
        const name = email.split('@')[0];
        const [[{ uuid }]] = await conexion.query('SELECT UUID() as uuid');
        console.log(uuid);
        const postQuery = `
      INSERT INTO user (id, name, email, password, rol)
        VALUES (UUID_TO_BIN(?), ?, ?, ?, ?)
    ;`;
        await conexion.query(postQuery, [uuid, name, password, email, rol]);
        const userPostedQuery = 'SELECT BIN_TO_UUID(id) as id, name, email, password, rol FROM user WHERE id = UUID_TO_BIN(?);';
        const userPostedData = await conexion.query(userPostedQuery, [uuid]);
        return userPostedData[0];
    }
    static async deleteUser(id) {
        const userToDeleteQuery = 'SELECT name, email FROM user WHERE id = UUID_TO_BIN(?);';
        const userToDeleteData = await conexion.query(userToDeleteQuery, [id]);
        const deleteQuery = `
      DELETE FROM user
      WHERE id = UUID_TO_BIN(?)
    ;`;
        const deleteQueryData = await conexion.query(deleteQuery, [id]);
        console.log(deleteQueryData);
        return userToDeleteData[0];
    }
}
