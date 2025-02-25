import { Request, Response } from 'express'
import crypto from 'node:crypto'
import { validateLoginUser, validateRegisterUser } from '../models/user.schema'
import UserModel from '../models/mysql/user.model'

export default class AuthController {
  private readonly salt

  constructor () {
    this.salt = crypto.randomBytes(12)
    this.register = this.register.bind(this)
    this.login = this.login.bind(this)
  }

  public async register (request: Request, response: Response): Promise<void> {
    const bodyValidation = validateRegisterUser(request.body)

    if (!bodyValidation.success) {
      response.status(400).json(bodyValidation.error)
      return
    }

    try {
      const { password, email, rol } = bodyValidation.data

      const hashedPassword = this.crypt(password)

      const userRegisted = await UserModel.postUser({ password: hashedPassword, email, rol })
      response.status(201).json(userRegisted)
    } catch (error) {
      console.log(error)
      response.status(500).json({ message: 'Error', error })
    }
  }

  public async login (request: Request, response: Response): Promise<void> {
    const bodyValidation = validateLoginUser(request.body)

    if (!bodyValidation.success) {
      response.status(400).json(bodyValidation.error)
      return
    }

    try {
      const { password, email } = bodyValidation.data

      const user = await UserModel.getUserByEmail(email)

      if (user === null) {
        response.status(404).json({ error: 'Email no encontrado' })
        return
      }
      const a = this.crypt(password)
      console.log(a, user.password)

      if (this.crypt(password) !== user.password) {
        response.status(401).json({ error: 'Contraseña incorrecta' })
        return
      }

      // TODO Token
      const token = 'adsa'
      response.json({ token })
    } catch (error) {
      console.log(error)
      response.status(500).json({ message: 'Error', error })
    }
  }

  public crypt (elm: string): string {
    return crypto.pbkdf2Sync(elm, this.salt, 100000, 64, 'sha512').toString('hex')
  }
}
