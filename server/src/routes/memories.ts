import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

export async function memoriesRoutes(app: FastifyInstance) {
  /* PARA REQUERER AUTENTICAÇÃO PARA UTILIZAR AS FUNÇÕES */
  app.addHook('preHandler', async (request) => {
    await request.jwtVerify()
  })
  /* BUSCAR TODAS AS MEMORIAS */
  app.get('/memories', async (request) => {
    const memories = await prisma.memory.findMany({
      where: {
        userId: request.user.sub,
      },
      orderBy: {
        createAt: 'asc',
      },
    })
    return memories.map((memory) => {
      return {
        id: memory.id,
        coverUrl: memory.civerUrl,
        excerpt: memory.content.substring(0, 115).concat('...'),
      }
    })
  })
  /* BUSCAR UMA MEMORIA ESPECIFICA */
  app.get('/memories/:id', async (request, reply) => {
    // const { id } = request.params
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id,
      },
    })

    if (!memory.isPublic && memory.userId !== request.user.sub) {
      return reply.status(401).send()
    }
    return memory
  })

  /* CRIAÇÃO DA MEMORIA */
  app.post('/memories', async (request) => {
    const bodySchema = z.object({
      content: z.string(),
      coverUrl: z.string(),
      isPublic: z.coerce.boolean().default(false),
    })
    const { content, coverUrl, isPublic } = bodySchema.parse(request.body)

    const memory = await prisma.memory.create({
      data: {
        content,
        coverUrl,
        isPublic,
        userId: request.user.sub,
      },
    })
    return memory
  })

  /* ATUALIZA VALORES DE UMA MEMORIA */
  app.put('/memories/:id', async (request, reply) => {
    // const { id } = request.params
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const bodySchema = z.object({
      content: z.string(),
      coverUrl: z.string(),
      isPublic: z.coerce.boolean().default(false),
    })
    const { content, coverUrl, isPublic } = bodySchema.parse(request.body)

    let memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id,
      },
    })

    if (memory.userId !== request.usr.sub) {
      return reply.status(401).send()
    }

    memory = await prisma.memory.update({
      where: {
        id,
      },
      data: {
        content,
        coverUrl,
        isPublic,
      },
    })

    return memory
  })

  /* DELETA UMA MEMORIA */
  app.delete('/memories/:id', async (request, reply) => {
    // const { id } = request.params
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id,
      },
    })

    if (memory.userId !== request.usr.sub) {
      return reply.status(401).send()
    }

    await prisma.memory.delete({
      where: {
        id,
      },
    })
  })
}
