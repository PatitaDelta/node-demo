import { Router } from 'express'
import { UserController } from './user.controller.js'

export function createUserRouter (): Router {
  const userRouter = Router()

  userRouter.get('/', UserController.getUsers)
  userRouter.get('/:id', UserController.getUser)

  return userRouter
}
