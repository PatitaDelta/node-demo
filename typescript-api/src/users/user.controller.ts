import { Request, Response } from 'express'
import { UserModel } from './models/mysql/user.model.js'

export class UserController {
  // constructor () { }

  public static getUsers (_: Request, response: Response): void {
    UserModel.getUsers().then((users) => {
      if (Object.keys(users).length !== 0) return response.json(users)
      return response.status(404).json({ message: 'No users found' })
    }).catch(console.log)
  }

  public static getUser (request: Request, response: Response): void {
    const { id } = request.params

    UserModel.getUserById(id).then((user) => {
      if (Object.keys(user).length !== 0) return response.json(user)
      return response.status(404).json({ message: 'User not found' })
    }).catch(console.log)
  }
}
