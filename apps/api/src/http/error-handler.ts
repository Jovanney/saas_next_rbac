import { FastifyInstance } from 'fastify'
import { ZodError } from 'zod'
import { BadRequest } from './routes/_errors/bad-request-error'
import { Unauthorized } from './routes/_errors/unauthorized-error'

type FastifyErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error',
      errors: error.flatten().fieldErrors,
    })
  }

  if (error instanceof BadRequest) {
    return reply.status(400).send({
      message: error.message,
    })
  }

  if (error instanceof Unauthorized) {
    return reply.status(401).send({
      message: error.message,
    })
  }

  console.log('error:', error)

  //send error to some obsersability tool

  return reply.status(500).send({
    message: 'Internal server error',
  })
}
