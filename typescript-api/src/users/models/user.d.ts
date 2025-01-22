import { Rol } from './user.enum.ts'

export interface User {
  id: string
  name: string
  password: string
  email: string
  rol: Rol
}

export type NoSensitiveInfoUser = Omit<User, 'id' | 'password' | 'rol'>
export type LoginUser = Pick<User, 'email' | 'password'>
export type RegisterUser = Pick<User, 'email' | 'password' | 'rol'>
