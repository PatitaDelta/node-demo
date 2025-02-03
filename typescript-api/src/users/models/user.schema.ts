import { SafeParseReturnType, z } from 'zod'
import { EditUser, IdUser, RegisterUser, User } from './user.js'

export const rolSchema = z.union([
  z.literal('admin'),
  z.literal('client'),
  z.literal('developer')
])

export const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  password: z.string(),
  email: z.string().email(),
  rol: rolSchema
})

export const noSensitiveInfoUserSchema = userSchema.omit({ id: true, password: true, rol: true })
export const loginUserSchema = userSchema.pick({ email: true, password: true })
export const registerUserSchema = userSchema.pick({ email: true, password: true, rol: true })
export const editUserSchema = userSchema.partial().omit({ id: true })
export const idUserSchema = userSchema.pick({ id: true })

export function validateRegisterUser (object: any): SafeParseReturnType<any, RegisterUser> {
  return registerUserSchema.safeParse(object)
}

export function validateUser (object: any): SafeParseReturnType<any, User> {
  return userSchema.safeParse(object)
}

export function validatePartialUser (object: any): SafeParseReturnType<any, EditUser> {
  return editUserSchema.safeParse(object)
}

export function validateIdUser (id: any): SafeParseReturnType<any, IdUser> {
  return idUserSchema.safeParse(id)
}
