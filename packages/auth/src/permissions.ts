import { AbilityBuilder } from '@casl/ability'
import { AppAbility } from '.'
import { User } from './models/user'
type PermissionsByRole = (
  user: User,
  builder: AbilityBuilder<AppAbility>
) => void

type Roles = 'ADMIN' | 'MEMBER'

export const permissions: Record<Roles, PermissionsByRole> = {
  ADMIN: (_, { can }) => {
    can('manage', 'all')
  },
  MEMBER: (_, { can }) => {
    can('invite', 'User')
  },
}
