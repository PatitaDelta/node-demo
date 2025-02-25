import UserModel from "./models/mysql/user.model.js";
import CsvService from "../utils/csv.service.js";
import PdfService from "../utils/pdf.service.js";
import fs from "node:fs/promises";
import { userKeys, validateFilesUser, validateIdUser, validatePartialUser, validateUser } from "./models/user.schema.js";
export default class UserController {
    dataUsersNoSensitive(_, response) {
        UserModel.getNoSensitiveInfoUsers().then((users) => {
            if (Object.keys(users).length === 0)
                return response.status(404).json({ message: "No users found" });
            return response.json(users);
        }).catch(error => {
            console.log(error);
            response.status(500).json({ message: "Error", error });
        });
    }
    dataUsersWithSensitive(_, response) {
        UserModel.getUsers().then((users) => {
            if (Object.keys(users).length === 0)
                return response.status(404).json({ message: "No users found" });
            return response.json(users);
        }).catch(error => {
            console.log(error);
            response.status(500).json({ message: "Error", error });
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
            if (Object.keys(user !== null && user !== void 0 ? user : {}).length === 0)
                return response.status(404).json({ message: "User not found" });
            return response.json(user);
        }).catch(error => {
            console.log(error);
            response.status(500).json({ message: "Error", error });
        });
    }
    async editUser(request, response) {
        const paramsBodyValidation = validateUser(Object.assign(Object.assign({}, request.params), request.body));
        if (!paramsBodyValidation.success) {
            response.status(400).json(paramsBodyValidation.error);
            return;
        }
        try {
            const { id, name, password, email, rol } = paramsBodyValidation.data;
            const queryData = await UserModel.putUser({ id, name, password, email, rol });
            const userEdited = await UserModel.getUserById(id);
            if (userEdited === undefined) {
                response.status(404).json({ message: "User not found" });
                return;
            }
            response.json({ data: userEdited, queryData });
        }
        catch (error) {
            console.log(error);
            response.status(500).json({ message: "Error", error });
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
                response.status(404).json({ message: "User not found" });
                return;
            }
            response.json({ data: userEditedPartial, queryData });
        }
        catch (error) {
            console.log(error);
            response.status(500).json({ message: "Error", error });
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
                response.status(404).json({ message: "User not found" });
                return;
            }
            const queryData = await UserModel.deleteUser(id);
            response.json({ data: userDelted, queryData });
        }
        catch (error) {
            console.error(error);
            response.status(500).json({ message: "User could not be deleted", error });
        }
    }
    async dataUsersCSV(request, response) {
        var _a, _b, _c;
        const queryParamsValidation = validateFilesUser(request.query);
        if (!queryParamsValidation.success) {
            response.status(400).json(queryParamsValidation.error);
            return;
        }
        const rows = (_a = queryParamsValidation.data.limit) !== null && _a !== void 0 ? _a : 100;
        const headers = (_b = queryParamsValidation.data.headers) !== null && _b !== void 0 ? _b : userKeys;
        const fileName = (_c = queryParamsValidation.data.name) !== null && _c !== void 0 ? _c : "users.csv";
        const fileDir = "./typescript-api/static/csv/";
        try {
            const users = await UserModel.getUsers(rows);
            const filePath = await CsvService.createCSV({
                fileName: (fileDir + String(fileName)),
                values: users,
                headers: headers.length > 0 ? headers : userKeys,
                noOfRows: rows,
                delimiter: ","
            });
            const file = await fs.readFile(filePath);
            response.setHeader("Content-disposition", `attachment; filename=${String(fileName)}`);
            response.set("Content-Type", "text/csv");
            response.send(file);
        }
        catch (error) {
            console.error(error);
            response.status(500).json({ message: "File could not be created", error });
        }
    }
    async dataUsersPDF(request, response) {
        var _a, _b, _c;
        const queryParamsValidation = validateFilesUser(request.query);
        if (!queryParamsValidation.success) {
            response.status(400).json(queryParamsValidation.error);
            return;
        }
        const rows = (_a = queryParamsValidation.data.limit) !== null && _a !== void 0 ? _a : 100;
        const headers = (_b = queryParamsValidation.data.headers) !== null && _b !== void 0 ? _b : userKeys;
        const fileName = (_c = queryParamsValidation.data.name) !== null && _c !== void 0 ? _c : "users.pdf";
        const fileDir = "./typescript-api/static/pdf/";
        try {
            const users = await UserModel.getUsers(rows);
            const filePath = await PdfService.createPDF({
                fileName: (fileDir + String(fileName)),
                values: users,
                headers: headers.length > 0 ? headers : userKeys,
                noOfRows: rows
            });
            const file = await fs.readFile(filePath);
            response.setHeader("Content-disposition", `attachment; filename=${String(fileName)}`);
            response.set("Content-Type", "application/pdf");
            response.send(file);
        }
        catch (error) {
            console.error(error);
            response.status(500).json({ message: "File could not be created", error });
        }
    }
}
