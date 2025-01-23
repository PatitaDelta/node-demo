import { Router } from 'express'
import UserController from './user.controller.js'
import { Router as asyncRouter } from '@root/async-router'

export function createUserRouter (): Router {
  const userRouter = asyncRouter()
  const userController = new UserController()

  userRouter.get('/', userController.dataUsersNoSensitive)
  userRouter.get('/sensitive', userController.dataUsersWithSensitive)
  userRouter.get('/csv', userController.dataUsersCSV)
  userRouter.get('/:id', userController.dataUser)

  userRouter.post('/', userController.registerUser)

  userRouter.delete('/:id', userController.removeUser)

  return userRouter
}
