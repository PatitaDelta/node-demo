import { Request, Response } from 'express'
import UserModel from './models/mysql/user.model.js'

export default class UserController {
  public dataUsersNoSensitive (_: Request, response: Response): void {
    UserModel.getNoSensitiveInfoUsers().then((users) => {
      if (Object.keys(users).length !== 0) return response.json(users)
      return response.status(404).json({ message: 'No users found' })
    }).catch(console.log)
  }

  public dataUsersWithSensitive (_: Request, response: Response): void {
    UserModel.getUsers().then((users) => {
      if (Object.keys(users).length !== 0) return response.json(users)
      return response.status(404).json({ message: 'No users found' })
    }).catch(console.log)
  }

  public dataUser (request: Request, response: Response): void {
    const { id } = request.params

    UserModel.getUserById(id).then((user) => {
      if (Object.keys(user).length !== 0) return response.json(user)
      return response.status(404).json({ message: 'User not found' })
    }).catch(console.log)
  }

  public registerUser (request: Request, response: Response): void {
    const { password, email, rol } = request.body
    // TODO zod
    UserModel.postUser({ password, email, rol }).then((user) => {
      if (Object.keys(user).length !== 0) return response.json(user)
      return response.status(500).json({ message: 'Error' })
    }).catch(console.log)
  }

  public removeUser (request: Request, response: Response): void {
    const { id } = request.params
    // TODO zod
    UserModel.deleteUser(id).then((user) => {
      if (Object.keys(user).length !== 0) return response.json(user)
      return response.status(404).json({ message: 'User not found' })
    }).catch(console.log)
  }

  // public dataUsersCSV (request: Request, response: Response): void {
  //   this.csv.createCSV()
  //   // response.status(404).json({ message: 'User not found' })
  // }
}
