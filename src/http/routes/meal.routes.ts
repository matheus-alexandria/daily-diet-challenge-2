import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { checkSessionId } from "../../middlewares/checkSessionId";

export async function mealRoutes(app: FastifyInstance) {
  app.post('/:id', {
    preHandler: [checkSessionId],
  }, async (request, reply) => {
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

    const meal = await prisma.meal.create({
      data: {
        name,
        description,
        on_diet: onDiet,
        schedule: new Date(),
        user_id: id
      }
    });

    return reply.status(201).send({
      meal,
    });
  });
}