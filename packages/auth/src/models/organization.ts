import { z } from 'Zod'

export const organizationSchema = z.object({
  __typename: z.literal('Organization').default('Organization'),
  id: z.string(),
  owerId: z.string(),
})

export type Organization = z.infer<typeof organizationSchema>
