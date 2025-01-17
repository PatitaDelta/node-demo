import { UserModel } from "./models/mysql/user.model.js";
export class UserController {
    constructor() { }
    static getUsers(_, response) {
        UserModel.getUsers().then((users) => {
            if (users)
                return response.json(users);
            return response.status(404).json({ message: 'No users found' });
        });
    }
    static getUser(request, response) {
        const { id } = request.params;
        UserModel.getUserById(id).then((user) => {
            if (user)
                return response.json(user);
            return response.status(404).json({ message: 'User not found' });
        });
    }
}
