import { z } from 'Zod'
import { roleSchema } from '../roles'

export const userSchema = z.object({
  id: z.string(),
  role: roleSchema,
})

export type User = z.infer<typeof userSchema>
