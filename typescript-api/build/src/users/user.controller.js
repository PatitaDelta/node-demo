import UserModel from './models/mysql/user.model.js';
import CsvService from '../utils/csv.service.js';
import PdfService from '../utils/pdf.service.js';
import fs from 'node:fs/promises';
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
            // if (Object.keys(user).length !== 0)
            return response.json(user);
        }).catch((error) => {
            console.log(error);
            return response.status(500).json({ message: 'Error', error });
        });
    }
    editUser(request, response) {
        const { id } = request.params;
        const { name, password, email, rol } = request.body;
        // TODO zod
        UserModel.putUser({ id, name, password, email, rol }).then((user) => {
            if (Object.keys(user).length !== 0)
                return response.json(user);
            return response.status(404).json({ message: 'User not found' });
        }).catch(console.log);
    }
    editPartialUser(request, response) {
        const { id } = request.params;
        const user = request.body;
        // TODO zod
        UserModel.patchUser(id, user).then((user) => {
            if (Object.keys(user).length !== 0)
                return response.json(user);
            return response.status(404).json({ message: 'User not found' });
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
        const rows = Number(request.query.limit);
        const headers = JSON.parse(String(request.query.headers ?? '[]'));
        const fileDir = './typescript-api/static/csv/';
        const fileName = 'users.csv';
        try {
            const users = await UserModel.getUsers(Number(rows));
            const filePath = await CsvService.createCSV(fileDir + fileName, users, headers, rows);
            const file = await fs.readFile(filePath);
            response.setHeader('Content-disposition', `attachment; filename=${fileName}`);
            response.set('Content-Type', 'text/csv');
            return response.send(file);
        }
        catch (error) {
            console.error(error);
            return response.status(500).json({ message: 'File could not be created', error });
        }
    }
    async dataUsersPDF(request, response) {
        const rows = Number(request.query.limit);
        const headers = JSON.parse(String(request.query.headers ?? '[]'));
        const fileDir = './typescript-api/static/pdf/';
        const fileName = 'users.pdf';
        try {
            const users = await UserModel.getUsers(Number(rows));
            const filePath = await PdfService.createPDF(fileDir + fileName, users, headers, rows);
            const file = await fs.readFile(filePath);
            response.setHeader('Content-disposition', `attachment; filename=${fileName}`);
            response.set('Content-Type', 'application/pdf');
            return response.send(file);
        }
        catch (error) {
            console.error(error);
            return response.status(500).json({ message: 'File could not be created', error });
        }
    }
}
