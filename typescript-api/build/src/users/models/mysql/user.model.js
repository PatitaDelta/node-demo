import mysql from 'mysql2/promise';
const conexion = await mysql.createConnection({
    host: 'node-demo-database',
    port: 3306,
    database: 'nodeDemoDB',
    user: 'guillermoll',
    password: '1234'
});
export default class UserModel {
    static defaultLimit = 100;
    static async getUsers(limit = UserModel.defaultLimit) {
        const query = 'SELECT BIN_TO_UUID(id) as id, name, email, password, rol FROM user LIMIT ?;';
        const data = await conexion.query(query, [limit]);
        return data[0];
    }
    static async getUserById(id) {
        const query = 'SELECT BIN_TO_UUID(id) as id, name, email, password, rol FROM user WHERE id = UUID_TO_BIN(?);';
        const [[data]] = await conexion.query(query, [id]);
        return data;
    }
    static async getNoSensitiveInfoUsers(limit = UserModel.defaultLimit) {
        const query = 'SELECT name, email FROM user WHERE LOWER(rol) NOT LIKE \'%admin%\' LIMIT ?;';
        const data = await conexion.query(query, [limit]);
        return data[0];
    }
    // Crear desde 0
    static async postUser(user) {
        const { password, email, rol } = user;
        const name = email.split('@')[0];
        const [[{ uuid: id }]] = await conexion.query('SELECT UUID() as uuid');
        const postQuery = `
      INSERT INTO user (id, name, email, password, rol)
        VALUES (UUID_TO_BIN(?), ?, ?, ?, ?)
    ;`;
        await conexion.query(postQuery, [id, name, email, password, rol]);
        // ! El siguiente codigo es una forma de hacerlo sin usar la funcion getUserById del UserModel
        // const userPostedQuery = 'SELECT BIN_TO_UUID(id) as id, name, email, password, rol FROM user WHERE id = UUID_TO_BIN(?);'
        // const userPostedData = await conexion.query(userPostedQuery, [uuid])
        // return data[0] as unknown as User
        const userPosted = await this.getUserById(id);
        return userPosted;
    }
    // Editar todo el usuario
    static async putUser(user) {
        const { id, name, password, email, rol } = user;
        const putQuery = `
      UPDATE user
      SET name = ?, password = ?, email = ?, rol = ?
      WHERE id = UUID_TO_BIN(?);
    ;`;
        const putData = await conexion.query(putQuery, [name, password, email, rol, id]);
        return putData[0];
    }
    // Editar solo una propiedad
    static async patchUser(id, user) {
        const [key, value] = Object.entries(user)[0];
        const patchQuery = `
      UPDATE user
      SET ${key} = ?
      WHERE id = UUID_TO_BIN(?);
    `;
        const patchData = await conexion.query(patchQuery, [value, id]);
        return patchData[0];
    }
    static async deleteUser(id) {
        const deleteQuery = `
      DELETE FROM user
      WHERE id = UUID_TO_BIN(?)
    ;`;
        const userDeleteData = await conexion.query(deleteQuery, [id]);
        return userDeleteData[0];
    }
}
