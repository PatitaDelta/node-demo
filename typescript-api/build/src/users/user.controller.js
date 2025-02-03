import UserModel from './models/mysql/user.model.js';
import CsvService from '../utils/csv.service.js';
import PdfService from '../utils/pdf.service.js';
import fs from 'node:fs/promises';
export default class UserController {
    dataUsersNoSensitive(_, response) {
        UserModel.getNoSensitiveInfoUsers().then((users) => {
            if (Object.keys(users).length === 0)
                return response.status(404).json({ message: 'No users found' });
            return response.json(users);
        }).catch(error => {
            console.log(error);
            response.status(500).json({ message: 'Error', error });
        });
    }
    dataUsersWithSensitive(_, response) {
        UserModel.getUsers().then((users) => {
            if (Object.keys(users).length === 0)
                return response.status(404).json({ message: 'No users found' });
            return response.json(users);
        }).catch(error => {
            console.log(error);
            response.status(500).json({ message: 'Error', error });
        });
    }
    dataUser(request, response) {
        const { id } = request.params;
        // TODO zod
        UserModel.getUserById(id).then((user) => {
            if (Object.keys(user).length === 0)
                return response.status(404).json({ message: 'User not found' });
            return response.json(user);
        }).catch(error => {
            console.log(error);
            response.status(500).json({ message: 'Error', error });
        });
    }
    async registerUser(request, response) {
        const { password, email, rol } = request.body;
        try {
            // TODO zod
            const userRegisted = await UserModel.postUser({ password, email, rol });
            response.json(userRegisted);
        }
        catch (error) {
            console.log(error);
            response.status(500).json({ message: 'Error', error });
        }
    }
    async editUser(request, response) {
        const { id } = request.params;
        const { name, password, email, rol } = request.body;
        // TODO zod
        try {
            const userEdited = await UserModel.putUser({ id, name, password, email, rol });
            if (Object.keys(userEdited).length === 0) {
                response.status(404).json({ message: 'User not found' });
                return;
            }
            response.json(userEdited);
        }
        catch (error) {
            console.log(error);
            response.status(500).json({ message: 'Error', error });
        }
    }
    async editPartialUser(request, response) {
        const { id } = request.params;
        const partialUser = request.body;
        // TODO zod
        try {
            const userEditedPartial = await UserModel.patchUser(id, partialUser);
            if (Object.keys(userEditedPartial).length === 0) {
                response.status(404).json({ message: 'User not found' });
                return;
            }
            response.json(userEditedPartial);
        }
        catch (error) {
            console.log(error);
            response.status(500).json({ message: 'Error', error });
        }
    }
    async removeUser(request, response) {
        const { id } = request.params;
        try {
            const userDelted = await UserModel.getUserById(id);
            if (Object.keys(userDelted).length === 0) {
                response.status(404).json({ message: 'User not found' });
                return;
            }
            const queryData = await UserModel.deleteUser(id);
            response.json({ user: userDelted, queryData });
        }
        catch (error) {
            console.error(error);
            response.status(500).json({ message: 'User could not be deleted', error });
        }
    }
    async dataUsersCSV(request, response) {
        const rows = request.query.limit === undefined
            ? undefined
            : Number(request.query.limit);
        const headers = request.query.headers === undefined
            ? undefined
            : JSON.parse(request.query.headers);
        const fileDir = './typescript-api/static/csv/';
        const fileName = 'users.csv';
        try {
            const users = await UserModel.getUsers(rows);
            const filePath = await CsvService.createCSV(fileDir + fileName, users, headers, rows);
            const file = await fs.readFile(filePath);
            response.setHeader('Content-disposition', `attachment; filename=${fileName}`);
            response.set('Content-Type', 'text/csv');
            response.send(file);
        }
        catch (error) {
            console.error(error);
            response.status(500).json({ message: 'File could not be created', error });
        }
    }
    async dataUsersPDF(request, response) {
        const rows = request.query.limit === undefined
            ? undefined
            : Number(request.query.limit);
        const headers = request.query.headers === undefined
            ? undefined
            : JSON.parse(request.query.headers);
        const fileDir = './typescript-api/static/pdf/';
        const fileName = 'users.pdf';
        try {
            const users = await UserModel.getUsers(rows);
            const filePath = await PdfService.createPDF({ fileName: (fileDir + fileName), values: users, headers, noOfRows: rows });
            const file = await fs.readFile(filePath);
            response.setHeader('Content-disposition', `attachment; filename=${fileName}`);
            response.set('Content-Type', 'application/pdf');
            response.send(file);
        }
        catch (error) {
            console.error(error);
            response.status(500).json({ message: 'File could not be created', error });
        }
    }
}
