import { z } from 'zod'
import { editUserSchema, idUserSchema, loginUserSchema, noSensitiveInfoUserSchema, registerUserSchema, userSchema } from './user.schema.ts'

// ! Estos son los types/interfaces de tsc sin usar ZOD
// export type Rol = 'admin' | 'client' | 'developer'
// export interface User {
//   id: string
//   name: string
//   password: string
//   email: string
//   rol: Rol
// }

// export type NoSensitiveInfoUser = Omit<User, 'id' | 'password' | 'rol'>
// export type LoginUser = Pick<User, 'email' | 'password'>
// export type RegisterUser = Pick<User, 'email' | 'password' | 'rol'>
// export type EditUser = Partial<Omit<User, 'id'>>
// export type EditUser = Partial<Pick<User, 'id'>>

export type Rol = z.infer<typeof rolSchema>
type UserSchemaToInterface = z.infer<typeof userSchema>
export interface User extends UserSchemaToInterface {}

export type NoSensitiveInfoUser = z.infer<typeof noSensitiveInfoUserSchema>
export type LoginUser = z.infer<typeof loginUserSchema>
export type RegisterUser = z.infer<typeof registerUserSchema>
export type EditUser = z.infer<typeof editUserSchema>
export type IdUser = z.infer<typeof idUserSchema>
