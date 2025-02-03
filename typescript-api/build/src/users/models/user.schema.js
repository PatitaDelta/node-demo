import { z } from 'zod';
export const rolSchema = z.union([
    z.literal('admin'),
    z.literal('client'),
    z.literal('developer')
]);
export const userSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    password: z.string(),
    email: z.string().email(),
    rol: rolSchema
});
export const noSensitiveInfoUserSchema = userSchema.omit({ id: true, password: true, rol: true });
export const loginUserSchema = userSchema.pick({ email: true, password: true });
export const registerUserSchema = userSchema.pick({ email: true, password: true, rol: true });
export const editUserSchema = userSchema.omit({ id: true });
export const idUserSchema = userSchema.pick({ id: true });
export function validateUser(object) {
    return userSchema.parse(object);
}
export function validatePartialUser(object) {
    return editUserSchema.partial().parse(object);
}
export function validateIdUser(id) {
    return editUserSchema.partial().parse(id);
}
