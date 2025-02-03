import UserModel from './models/mysql/user.model.js';
import CsvService from '../utils/csv.service.js';
import PdfService from '../utils/pdf.service.js';
import fs from 'node:fs/promises';
import { validateIdUser, validatePartialUser, validateRegisterUser, validateUser } from './models/user.schema.js';
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
        const paramsValidation = validateIdUser(request.params);
        if (!paramsValidation.success) {
            response.status(400).json(paramsValidation.error);
            return;
        }
        const { id } = paramsValidation.data;
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
        const bodyValidation = validateRegisterUser(request.body);
        if (!bodyValidation.success) {
            response.status(400).json(bodyValidation.error);
            return;
        }
        try {
            // TODO seprar el patch del get
            const { password, email, rol } = bodyValidation.data;
            const userRegisted = await UserModel.postUser({ password, email, rol });
            response.json(userRegisted);
        }
        catch (error) {
            console.log(error);
            response.status(500).json({ message: 'Error', error });
        }
    }
    async editUser(request, response) {
        const paramsBodyValidation = validateUser({ ...request.params, ...request.body });
        if (!paramsBodyValidation.success) {
            response.status(400).json(paramsBodyValidation.error);
            return;
        }
        try {
            const { id, name, password, email, rol } = paramsBodyValidation.data;
            const queryData = await UserModel.putUser({ id, name, password, email, rol });
            const userEdited = await UserModel.getUserById(id);
            if (userEdited === undefined) {
                response.status(404).json({ message: 'User not found' });
                return;
            }
            response.json({ user: userEdited, queryData });
        }
        catch (error) {
            console.log(error);
            response.status(500).json({ message: 'Error', error });
        }
    }
    async editPartialUser(request, response) {
        const bodyValidation = validatePartialUser(request.body);
        const paramsValidation = validateIdUser(request.params);
        if (!paramsValidation.success) {
            response.status(400).json(paramsValidation.error);
            return;
        }
        if (!bodyValidation.success) {
            response.status(400).json(bodyValidation.error);
            return;
        }
        try {
            const partialUser = bodyValidation.data;
            const { id } = paramsValidation.data;
            const queryData = await UserModel.patchUser(id, partialUser);
            const userEditedPartial = await UserModel.getUserById(id);
            if (userEditedPartial === undefined) {
                response.status(404).json({ message: 'User not found' });
                return;
            }
            response.json({ user: userEditedPartial, queryData });
        }
        catch (error) {
            console.log(error);
            response.status(500).json({ message: 'Error', error });
        }
    }
    async removeUser(request, response) {
        const paramsValidation = validateIdUser(request.params);
        if (!paramsValidation.success) {
            response.status(400).json(paramsValidation.error);
            return;
        }
        try {
            const { id } = paramsValidation.data;
            const userDelted = await UserModel.getUserById(id);
            if (userDelted === undefined) {
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
        // TODO ZOD
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
        // TODO ZOD
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
