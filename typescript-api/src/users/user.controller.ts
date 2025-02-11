import { Request, Response } from 'express'
import UserModel from './models/mysql/user.model'
import { EditUser, User } from './models/user'
import CsvService from '../utils/csv.service'
import PdfService from '../utils/pdf.service'
import fs from 'node:fs/promises'
import crypto from 'node:crypto'
import { userKeys, validateFilesUser, validateIdUser, validatePartialUser, validateRegisterUser, validateUser } from './models/user.schema'

export default class UserController {
  public dataUsersNoSensitive (_: Request, response: Response): void {
    UserModel.getNoSensitiveInfoUsers().then((users) => {
      if (Object.keys(users).length === 0) return response.status(404).json({ message: 'No users found' })
      return response.json(users)
    }).catch(error => {
      console.log(error)
      response.status(500).json({ message: 'Error', error })
    })
  }

  public dataUsersWithSensitive (_: Request, response: Response): void {
    UserModel.getUsers().then((users) => {
      if (Object.keys(users).length === 0) return response.status(404).json({ message: 'No users found' })
      return response.json(users)
    }).catch(error => {
      console.log(error)
      response.status(500).json({ message: 'Error', error })
    })
  }

  public dataUser (request: Request, response: Response): void {
    const paramsValidation = validateIdUser(request.params)

    if (!paramsValidation.success) {
      response.status(400).json(paramsValidation.error)
      return
    }

    const { id } = paramsValidation.data

    UserModel.getUserById(id).then((user) => {
      if (Object.keys(user ?? {}).length === 0) return response.status(404).json({ message: 'User not found' })
      return response.json(user)
    }).catch(error => {
      console.log(error)
      response.status(500).json({ message: 'Error', error })
    })
  }

  public async registerUser (request: Request, response: Response): Promise<void> {
    const bodyValidation = validateRegisterUser(request.body)

    if (bodyValidation.success === false) {
      response.status(400).json(bodyValidation.error)
      return
    }

    try {
      const { password, email, rol } = bodyValidation.data

      const hashedPassword = crypto.pbkdf2Sync(password, crypto.randomBytes(12), 100000, 64, 'sha512').toString('hex')

      const userRegisted = await UserModel.postUser({ password: hashedPassword, email, rol })
      response.status(201).json(userRegisted)
    } catch (error) {
      console.log(error)
      response.status(500).json({ message: 'Error', error })
    }
  }

  public async editUser (request: Request, response: Response): Promise<void> {
    const paramsBodyValidation = validateUser({ ...request.params, ...request.body })

    if (!paramsBodyValidation.success) {
      response.status(400).json(paramsBodyValidation.error)
      return
    }

    try {
      const { id, name, password, email, rol } = paramsBodyValidation.data

      const queryData = await UserModel.putUser({ id, name, password, email, rol })
      const userEdited = await UserModel.getUserById(id)

      if (userEdited === undefined) {
        response.status(404).json({ message: 'User not found' })
        return
      }

      response.json({ user: userEdited, queryData })
    } catch (error) {
      console.log(error)
      response.status(500).json({ message: 'Error', error })
    }
  }

  public async editPartialUser (request: Request, response: Response): Promise<void> {
    const bodyValidation = validatePartialUser(request.body)
    const paramsValidation = validateIdUser(request.params)

    if (!paramsValidation.success) {
      response.status(400).json(paramsValidation.error)
      return
    }

    if (!bodyValidation.success) {
      response.status(400).json(bodyValidation.error)
      return
    }

    try {
      const partialUser: EditUser = bodyValidation.data
      const { id } = paramsValidation.data

      const queryData = await UserModel.patchUser(id, partialUser)
      const userEditedPartial = await UserModel.getUserById(id)

      if (userEditedPartial === undefined) {
        response.status(404).json({ message: 'User not found' })
        return
      }
      response.json({ user: userEditedPartial, queryData })
    } catch (error) {
      console.log(error)
      response.status(500).json({ message: 'Error', error })
    }
  }

  public async removeUser (request: Request, response: Response): Promise<void> {
    const paramsValidation = validateIdUser(request.params)

    if (!paramsValidation.success) {
      response.status(400).json(paramsValidation.error)
      return
    }

    try {
      const { id } = paramsValidation.data
      const userDelted = await UserModel.getUserById(id)

      if (userDelted === undefined) {
        response.status(404).json({ message: 'User not found' })
        return
      }

      const queryData = await UserModel.deleteUser(id)
      response.json({ user: userDelted, queryData })
    } catch (error) {
      console.error(error)
      response.status(500).json({ message: 'User could not be deleted', error })
    }
  }

  public async dataUsersCSV (request: Request, response: Response): Promise<void> {
    const queryParamsValidation = validateFilesUser(request.query)
    if (!queryParamsValidation.success) {
      response.status(400).json(queryParamsValidation.error)
      return
    }

    const rows = queryParamsValidation.data.limit ?? 100
    const headers = queryParamsValidation.data.headers ?? userKeys
    const fileName = queryParamsValidation.data.name ?? 'users.csv'
    const fileDir = './typescript-api/static/csv/'

    try {
      const users = await UserModel.getUsers(rows)
      const filePath = await CsvService.createCSV<User>({
        fileName: (fileDir + String(fileName)),
        values: users,
        headers: headers.length > 0 ? headers : userKeys,
        noOfRows: rows,
        delimiter: ','
      })

      const file = await fs.readFile(filePath)

      response.setHeader('Content-disposition', `attachment; filename=${String(fileName)}`)
      response.set('Content-Type', 'text/csv')

      response.send(file)
    } catch (error) {
      console.error(error)
      response.status(500).json({ message: 'File could not be created', error })
    }
  }

  public async dataUsersPDF (request: Request, response: Response): Promise<void> {
    const queryParamsValidation = validateFilesUser(request.query)
    if (!queryParamsValidation.success) {
      response.status(400).json(queryParamsValidation.error)
      return
    }

    const rows = queryParamsValidation.data.limit ?? 100
    const headers = queryParamsValidation.data.headers ?? userKeys
    const fileName = queryParamsValidation.data.name ?? 'users.pdf'
    const fileDir = './typescript-api/static/pdf/'

    try {
      const users = await UserModel.getUsers(rows)
      const filePath = await PdfService.createPDF<User>({
        fileName: (fileDir + String(fileName)),
        values: users,
        headers: headers.length > 0 ? headers : userKeys,
        noOfRows: rows
      })

      const file = await fs.readFile(filePath)

      response.setHeader('Content-disposition', `attachment; filename=${String(fileName)}`)
      response.set('Content-Type', 'application/pdf')

      response.send(file)
    } catch (error) {
      console.error(error)
      response.status(500).json({ message: 'File could not be created', error })
    }
  }
}
