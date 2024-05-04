import { defineAbilityFor, projectSchema } from '@saas/auth'

const ability = defineAbilityFor({ role: 'MEMBER', id: '1' })

const project = projectSchema.parse({ id: '1', owerId: '1' })

const userCanInviteSomeoneElse = ability.can('invite', 'User')

console.log(ability.can('delete', project))
console.log('userCanInviteSomeoneElse:', userCanInviteSomeoneElse)
