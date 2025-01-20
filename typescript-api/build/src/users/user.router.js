import { Router } from 'express';
import UserController from './user.controller.js';
export function createUserRouter() {
    const userRouter = Router();
    const userController = new UserController();
    userRouter.get('/', userController.dataUsersNoSensitive);
    userRouter.get('/sensitive', userController.dataUsersWithSensitive);
    userRouter.get('/:id', userController.dataUser);
    // userRouter.get('/csv', userController.dataUsersCSV)
    userRouter.post('/', userController.registerUser);
    userRouter.delete('/:id', userController.removeUser);
    return userRouter;
}
