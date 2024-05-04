import { AbilityBuilder } from '@casl/ability'
import { AppAbility } from '.'
import { User } from './models/user'
import { Role } from './roles'
type PermissionsByRole = (
  user: User,
  builder: AbilityBuilder<AppAbility>
) => void

export const permissions: Record<Role, PermissionsByRole> = {
  ADMIN: (user, { can, cannot }) => {
    // no momento em que eu dou o manage all para o role as condições de negação não funcionariam
    can('manage', 'all')

    cannot(['transfer_ownership', 'update'], 'Organization')
    can(['transfer_ownership', 'update'], 'Organization', {
      owerId: { $eq: user.id },
    })
  },
  MEMBER: (user, { can }) => {
    can('get', 'User')
    can(['create', 'get'], 'Project')
    can(['delete', 'update'], 'Project', { owerId: { $eq: user.id } })
  },
  BILLING: (_, { can }) => {
    can('manage', 'Billing')
  },
}
