import { Router } from 'express'
import { HomeController } from './home.contoller.js'

export function createHomeRouter(): Router {
  const homeRouter = Router()
  const homeController = new HomeController()

  homeRouter.get('/', homeController.homePage)
  homeRouter.get('/ping', homeController.ping)

  return homeRouter
}
