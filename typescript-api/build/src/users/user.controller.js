import { UserModel } from './models/mysql/user.model.js';
export class UserController {
    // constructor () { }
    static getUsers(_, response) {
        UserModel.getNoSensitiveInfoUsers().then((users) => {
            if (Object.keys(users).length !== 0)
                return response.json(users);
            return response.status(404).json({ message: 'No users found' });
        }).catch(console.log);
    }
    static getUser(request, response) {
        const { id } = request.params;
        UserModel.getUserById(id).then((user) => {
            if (Object.keys(user).length !== 0)
                return response.json(user);
            return response.status(404).json({ message: 'User not found' });
        }).catch(console.log);
    }
}
