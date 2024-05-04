import { z } from 'Zod'
import { roleSchema } from '../roles'

export const userSchema = z.object({
  role: roleSchema,
})

export type User = z.infer<typeof userSchema>
