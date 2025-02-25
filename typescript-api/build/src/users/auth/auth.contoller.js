import UserController from "../user.controller.js";
import crypto from "node:crypto";
import { validateLoginUser, validateRegisterUser } from "../models/user.schema.js";
import UserModel from "../models/mysql/user.model.js";
export default class AuthController {
    constructor() {
        this.userController = new UserController();
    }
    async register(request, response) {
        const bodyValidation = validateRegisterUser(request.body);
        if (!bodyValidation.success) {
            response.status(400).json(bodyValidation.error);
            return;
        }
        try {
            const { password, email, rol } = bodyValidation.data;
            const hashedPassword = crypto.pbkdf2Sync(password, crypto.randomBytes(12), 100000, 64, "sha512").toString("hex");
            const userRegisted = await UserModel.postUser({ password: hashedPassword, email, rol });
            response.status(201).json(userRegisted);
        }
        catch (error) {
            console.log(error);
            response.status(500).json({ message: "Error", error });
        }
    }
    async login(request, response) {
        const bodyValidation = validateLoginUser(request.body);
        if (!bodyValidation.success) {
            response.status(400).json(bodyValidation.error);
            return;
        }
        try {
            const { password, email } = bodyValidation.data;
            const User = await UserModel.getUserByEmail(email);
            console.log(User, password);
        }
        catch (error) {
            console.log(error);
            response.status(500).json({ message: "Error", error });
        }
    }
}
