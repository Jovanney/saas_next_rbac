import { AbilityBuilder } from '@casl/ability'
import { AppAbility } from '.'
import { User } from './models/user'
import { Role } from './roles'
type PermissionsByRole = (
  user: User,
  builder: AbilityBuilder<AppAbility>
) => void

export const permissions: Record<Role, PermissionsByRole> = {
  ADMIN: (_, { can }) => {
    can('manage', 'all')
  },
  MEMBER: (user, { can }) => {
    can('create', 'Project')
    can(['create', 'delete'], 'Project', { owerId: { $eq: user.id } })
  },
  BILLING: (_, { can }) => {
    can('invite', 'User')
  },
}
