import UserController from './user.controller.js';
import { Router as asyncRouter } from '@root/async-router';
export function createUserRouter() {
    const userRouter = asyncRouter();
    const userController = new UserController();
    userRouter.get('/', userController.dataUsersNoSensitive);
    userRouter.get('/sensitive', userController.dataUsersWithSensitive);
    userRouter.get('/csv', userController.dataUsersCSV);
    userRouter.get('/:id', userController.dataUser);
    userRouter.post('/', userController.registerUser);
    userRouter.put('/:id', userController.editUser);
    userRouter.patch('/:id', userController.editPartialUser);
    userRouter.delete('/:id', userController.removeUser);
    return userRouter;
}
