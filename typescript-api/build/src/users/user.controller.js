import UserModel from './models/mysql/user.model.js';
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
}
