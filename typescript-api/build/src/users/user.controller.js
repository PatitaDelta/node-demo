import UserModel from './models/mysql/user.model.js';
import CsvService from '../utils/csv.service.js';
export default class UserController {
    dataUsersNoSensitive(_, response) {
        UserModel.getNoSensitiveInfoUsers().then((users) => {
            if (Object.keys(users).length !== 0)
                return response.json(users);
            return response.status(404).json({ message: 'No users found' });
        }).catch(console.log);
    }
    dataUsersWithSensitive(_, response) {
        UserModel.getUsers().then((users) => {
            if (Object.keys(users).length !== 0)
                return response.json(users);
            return response.status(404).json({ message: 'No users found' });
        }).catch(console.log);
    }
    dataUser(request, response) {
        const { id } = request.params;
        UserModel.getUserById(id).then((user) => {
            if (Object.keys(user).length !== 0)
                return response.json(user);
            return response.status(404).json({ message: 'User not found' });
        }).catch(console.log);
    }
    registerUser(request, response) {
        const { password, email, rol } = request.body;
        // TODO zod
        UserModel.postUser({ password, email, rol }).then((user) => {
            if (Object.keys(user).length !== 0)
                return response.json(user);
            return response.status(500).json({ message: 'Error' });
        }).catch(console.log);
    }
    removeUser(request, response) {
        const { id } = request.params;
        // TODO zod
        UserModel.deleteUser(id).then((user) => {
            if (Object.keys(user).length !== 0)
                return response.json(user);
            return response.status(404).json({ message: 'User not found' });
        }).catch(console.log);
    }
    async dataUsersCSV(request, response) {
        const limit = Number(request.query.limit);
        const headers = JSON.parse(String(request.query.headers));
        try {
            const users = await UserModel.getUsers(Number(limit));
            const file = await CsvService.createCSV('./typescript-api/static/csv/users', users, headers);
            // TODO devolver el archivo csv para que se descargue
            response.setHeader('Content-disposition', 'attachment; filename=data.csv');
            response.set('Content-Type', 'text/csv');
            console.log(file);
            return response.status(200).send([]);
        }
        catch (error) {
            console.error(error);
            return response.status(500).json({ message: 'File could not be created', error });
        }
    }
}
