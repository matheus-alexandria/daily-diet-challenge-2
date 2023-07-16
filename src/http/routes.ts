import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { randomUUID } from "crypto";

export async function appRoutes(app: FastifyInstance) {
  app.post('/user', async (request, reply) => {
    const requestBodySchema = z.object({
      name: z.string(),
    });

    const { name } = requestBodySchema.parse(request.body);

    const cookie = randomUUID();
    reply.cookie('sessionId', cookie, {
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7 // A week (7 days)
    });

    await prisma.user.create({
      data: {
        name
      }
    });
    
    return reply.status(201).send();
  });

  app.post('/meal/:id', async (request, reply) => {
    const requestParamsSchema = z.object({
      id: z.string().uuid()
    });

    const requestBodySchema = z.object({
      name: z.string(),
      description: z.string().optional(),
      onDiet: z.boolean(),
    });

    const { id } = requestParamsSchema.parse(request.params);

    const { name, description, onDiet } = requestBodySchema.parse(request.body);

    const user = prisma.user.findFirst({
      where: {
        id,
      }
    });

    if (!user) {
      throw new Error('User does not exist');
    }

    await prisma.meal.create({
      data: {
        name,
        description,
        on_diet: onDiet,
        schedule: new Date(),
        user_id: id
      }
    });

    return reply.status(201).send();
  });
}