import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { randomUUID } from "crypto";

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

    await prisma.user.create({
      data: {
        name,
        email
      }
    });
    
    return reply.status(201).send();
  });
}