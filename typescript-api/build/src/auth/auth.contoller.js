import crypto from "node:crypto";
import { validateLoginUser, validateRegisterUser } from "../users/models/user.schema.js";
import UserModel from "../users/models/mysql/user.model.js";
export default class AuthController {
    constructor() {
        this.salt = crypto.randomBytes(12);
        this.register = this.register.bind(this);
        this.login = this.login.bind(this);
    }
    async register(request, response) {
        const bodyValidation = validateRegisterUser(request.body);
        if (!bodyValidation.success) {
            response.status(400).json(bodyValidation.error);
            return;
        }
        try {
            const { password, email, rol } = bodyValidation.data;
            const hashedPassword = this.crypt(password);
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
            const user = await UserModel.getUserByEmail(email);
            if (user === null) {
                response.status(404).json({ error: "Email no encontrado" });
                return;
            }
            const a = this.crypt(password);
            console.log(a, user.password);
            if (this.crypt(password) !== user.password) {
                response.status(401).json({ error: "Contrase\u00F1a incorrecta" });
                return;
            }
            const token = "adsa";
            response.json({ token });
        }
        catch (error) {
            console.log(error);
            response.status(500).json({ message: "Error", error });
        }
    }
    crypt(elm) {
        return crypto.pbkdf2Sync(elm, this.salt, 100000, 64, "sha512").toString("hex");
    }
}
