import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export function appRoutes(app: FastifyInstance) {
  app.post('/user', async (request, reply) => {
    const requestBodySchema = z.object({
      name: z.string(),
    });

    const { name } = requestBodySchema.parse(request.body);

    await prisma.user.create({
      data: {
        name
      }
    });
    
    return reply.status(201).send();
  });
}