'use client'

import { type Role, roleSchema } from '@saas/auth'
import type { ComponentProps } from 'react'

import { updateMemberAction } from './actions'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type UpdateMemberRoleSelectProps = ComponentProps<typeof Select> & {
  memberId: string
}

export const UpdateMemberRoleSelect = ({
  memberId,
  ...props
}: UpdateMemberRoleSelectProps) => {
  const rolesArray = roleSchema.options.map((option) => option.value)

  const updateMemberRole = async (role: Role) => {
    await updateMemberAction(memberId, role)
  }

  return (
    <Select onValueChange={updateMemberRole} {...props}>
      <SelectTrigger className="w-32">
        <SelectValue />
      </SelectTrigger>

      <SelectContent>
        {rolesArray.map((role) => (
          <SelectItem key={role} value={role} className="capitalize">
            {role}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
