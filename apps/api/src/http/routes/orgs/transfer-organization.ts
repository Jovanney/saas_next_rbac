import { organizationSchema } from '@saas/auth'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { BadRequest } from '@/http/routes/_errors/bad-request-error'
import { Unauthorized } from '@/http/routes/_errors/unauthorized-error'
import { getUserPermissions } from '@/utils/get-user-permissions'
import { prisma } from '@/http/lib/prisma'

export async function transferOrganization(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .patch(
      '/organizations/:slug/owner',
      {
        schema: {
          tags: ['Organizations'],
          summary: 'Transfer organization ownership',
          security: [{ bearerAuth: [] }],
          body: z.object({
            transferToUserId: z.string().uuid(),
          }),
          params: z.object({
            slug: z.string(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const userId = await request.getCurrentUserId()
        const { membership, organization } =
          await request.getUserMembership(slug)

        const authOrganization = organizationSchema.parse(organization)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('transfer_ownership', authOrganization)) {
          throw new Unauthorized(
            `You're not allowed to transfer this organization ownership.`
          )
        }

        const { transferToUserId } = request.body

        const transferMembership = await prisma.member.findUnique({
          where: {
            userId_organizationId: {
              userId: transferToUserId,
              organizationId: organization.id,
            },
          },
        })

        if (!transferMembership) {
          throw new BadRequest(
            'Target user is not a member of this organization.'
          )
        }

        await prisma.$transaction([
          prisma.member.update({
            where: {
              userId_organizationId: {
                userId: transferToUserId,
                organizationId: organization.id,
              },
            },
            data: {
              role: 'ADMIN',
            },
          }),
          prisma.organization.update({
            where: { id: organization.id },
            data: { ownerId: transferToUserId },
          }),
        ])
        return reply.status(204).send()
      }
    )
}
