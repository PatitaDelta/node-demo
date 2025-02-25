import { Router } from 'express'
import { Router as asyncRouter } from '@root/async-router'
import AuthController from './auth.contoller'

export default function createAuthRouter (): Router {
  const authRouter = asyncRouter()
  const authController = new AuthController()

  authRouter.post('/login', authController.login)
  authRouter.post('/register', authController.register)

  return authRouter
}
