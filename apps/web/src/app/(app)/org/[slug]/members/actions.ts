'use server'

import { getCurrentOrg } from '@/app/auth/auth'
import { removeMember } from '@/http/remove-member'
import { revalidateTag } from 'next/cache'

export async function removeMemberAction(memberId: string) {
  const currentOrg = getCurrentOrg()

  await removeMember({
    org: currentOrg!,
    memberId,
  })

  revalidateTag(`${currentOrg}/members`)
}
