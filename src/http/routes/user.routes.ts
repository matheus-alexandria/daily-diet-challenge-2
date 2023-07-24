import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { randomUUID } from "crypto";
import { checkSessionId } from "../../middlewares/checkSessionId";

export async function userRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const requestBodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
    });

    const { name, email } = requestBodySchema.parse(request.body);

    const cookie = randomUUID();
    reply.cookie('sessionId', cookie, {
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7 // A week (7 days)
    });

    const user = await prisma.user.create({
      data: {
        name,
        email
      }
    });
    
    return reply.status(201).send({
      user
    });
  });

  app.post('/session', async (request, reply) => {
    const userDataRequestSchema = z.object({
      email: z.string().email(),
    });

    const { email } = userDataRequestSchema.parse(request.body);

    const user = await prisma.user.findFirst({
      where: {
        email
      }
    });

    if (!user) {
      return reply.status(400).send({
        message: 'Invalid credential.'
      })
    }

    const cookie = randomUUID();
    reply.cookie('sessionId', cookie, {
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7 // A week (7 days)
    });

    return reply.send({
      user,
      cookie,
    });
  });

  app.get('/:userId/meals', {
    preHandler: [checkSessionId],
  }, async (request, reply) => {
    const requestParamsSchema = z.object({
      userId: z.string().uuid()
    });

    const { userId } = requestParamsSchema.parse(request.params);

    const user = await prisma.user.findFirst({
      where: {
        id: userId
      }
    });

    if (!user) {
      return reply.status(404).send({
        error: 'User not found'
      });
    }

    const requestQuerySchema = z.object({
      onDiet: z.string().transform((val) => {
        return val === '' ? undefined : Number(val)
      }),
    });

    const { onDiet } = requestQuerySchema.parse(request.query);

    const meals = await prisma.meal.findMany({
      where: {
        user_id: userId,
        on_diet: onDiet,
      }
    });

    return reply.send(meals);
  });

  app.get('/:userId/meals/streak', {
    preHandler: [checkSessionId],
  }, async (request, reply) => {
    const requestParamsSchema = z.object({
      userId: z.string().uuid()
    });

    const { userId } = requestParamsSchema.parse(request.params);

    const user = await prisma.user.findFirst({
      where: {
        id: userId
      }
    });

    if (!user) {
      return reply.status(404).send({
        error: 'User not found'
      });
    }

    const meals = await prisma.meal.findMany({
      where: {
        user_id: userId,
      }
    });

    return reply.send(meals);
  });
}