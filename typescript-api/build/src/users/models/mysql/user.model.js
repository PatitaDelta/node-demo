import { MysqlConfig } from "./mysql.config.js";
class UserModel {
    static async getUsers(limit = UserModel.defaultLimit) {
        const connection = await MysqlConfig.getConnection();
        const query = "SELECT BIN_TO_UUID(id) as id, name, email, password, rol FROM user LIMIT ?;";
        const data = await connection.query(query, [limit]);
        await MysqlConfig.closeConnection(connection);
        return data[0];
    }
    static async getUserByEmail(email) {
        const connection = await MysqlConfig.getConnection();
        const query = "SELECT BIN_TO_UUID(id) as id, name, email, password, rol FROM user WHERE email = ?;";
        const [[data]] = await connection.query(query, [email]);
        await MysqlConfig.closeConnection(connection);
        return data;
    }
    static async getUserById(id) {
        const connection = await MysqlConfig.getConnection();
        const query = "SELECT BIN_TO_UUID(id) as id, name, email, password, rol FROM user WHERE id = UUID_TO_BIN(?);";
        const [[data]] = await connection.query(query, [id]);
        await MysqlConfig.closeConnection(connection);
        return data;
    }
    static async getNoSensitiveInfoUsers(limit = UserModel.defaultLimit) {
        const connection = await MysqlConfig.getConnection();
        const query = "SELECT name, email FROM user WHERE LOWER(rol) NOT LIKE '%admin%' LIMIT ?;";
        const data = await connection.query(query, [limit]);
        await MysqlConfig.closeConnection(connection);
        return data[0];
    }
    static async postUser(user) {
        const connection = await MysqlConfig.getConnection();
        const { password, email, rol } = user;
        const name = email.split("@")[0];
        const [[{ uuid: id }]] = await connection.query("SELECT UUID() as uuid");
        const postQuery = `
      INSERT INTO user (id, name, email, password, rol)
        VALUES (UUID_TO_BIN(?), ?, ?, ?, ?)
    ;`;
        await connection.query(postQuery, [id, name, email, password, rol]);
        const userPosted = await this.getUserById(id);
        await MysqlConfig.closeConnection(connection);
        return userPosted;
    }
    static async putUser(user) {
        const connection = await MysqlConfig.getConnection();
        const { id, name, password, email, rol } = user;
        const putQuery = `
      UPDATE user
      SET name = ?, password = ?, email = ?, rol = ?
      WHERE id = UUID_TO_BIN(?);
    ;`;
        const putData = await connection.query(putQuery, [name, password, email, rol, id]);
        await MysqlConfig.closeConnection(connection);
        return putData[0];
    }
    static async patchUser(id, user) {
        const connection = await MysqlConfig.getConnection();
        const [key, value] = Object.entries(user)[0];
        const patchQuery = `
      UPDATE user
      SET ${key} = ?
      WHERE id = UUID_TO_BIN(?);
    `;
        const patchData = await connection.query(patchQuery, [value, id]);
        await MysqlConfig.closeConnection(connection);
        return patchData[0];
    }
    static async deleteUser(id) {
        const connection = await MysqlConfig.getConnection();
        const deleteQuery = `
      DELETE FROM user
      WHERE id = UUID_TO_BIN(?)
    ;`;
        const userDeleteData = await connection.query(deleteQuery, [id]);
        await MysqlConfig.closeConnection(connection);
        return userDeleteData[0];
    }
}
UserModel.defaultLimit = 100;
export default UserModel;
