import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { checkSessionId } from "../../middlewares/checkSessionId";

export async function mealRoutes(app: FastifyInstance) {
  app.post('/:userId', {
    preHandler: [checkSessionId],
  }, async (request, reply) => {
    const requestParamsSchema = z.object({
      userId: z.string().uuid()
    });

    const requestBodySchema = z.object({
      name: z.string(),
      description: z.string().optional(),
      schedule: z.coerce.date(),
      onDiet: z.boolean(),
    });

    const { userId } = requestParamsSchema.parse(request.params);

    const { name, description, schedule, onDiet } = requestBodySchema.parse(request.body);

    const user = prisma.user.findFirst({
      where: {
        id: userId,
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
        schedule,
        user_id: userId
      }
    });

    return reply.status(201).send({
      meal,
    });
  });
}