import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { checkSessionId } from "../../middlewares/checkSessionId";

export async function mealRoutes(app: FastifyInstance) {
  app.get(':mealId', async (request, reply) => {
    const requestParamsSchema = z.object({
      mealId: z.string().uuid()
    });

    const { mealId } = requestParamsSchema.parse(request.params);

    const meal = await prisma.meal.findFirst({
      where: {
        id: mealId
      }
    });

    if (!meal) {
      return reply.status(404).send({
        error: 'Content not found',
      });
    }

    return {
      meal,
    }
  });

  app.get('/:userId', {
    preHandler: [checkSessionId]
  }, async (request, _) => {
    const requestParamsSchema = z.object({
      userId: z.string().uuid()
    });

    const { userId } = requestParamsSchema.parse(request.params);

    const meals = await prisma.meal.findMany({
      where: {
        user_id: userId
      }
    });

    return {
      meals: meals ?? []
    }
  });

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
      onDiet: z.coerce.number(),
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

  app.put('/:id', { 
    preHandler: [checkSessionId]
  }, async (request, reply) => {
    const updateDataSchema = z.object({
      name: z.string().optional(),
      description: z.string().optional(),
      schedule: z.coerce.date().optional(),
      onDiet: z.coerce.number().optional(),
    });

    const routeParamsSchema = z.object({
      id: z.string().uuid(),
    });

    const { 
      name, 
      description, 
      schedule, 
      onDiet 
    } = updateDataSchema.parse(request.body);

    const { id } = routeParamsSchema.parse(request.params);

    const meal = await prisma.meal.findFirst({
      where: {
        id,
      }
    });

    if (!meal) {
      return reply.status(400).send({
        error: 'Meal not found'
      });
    }

    const updatedMeal = await prisma.meal.update({
      where: {
        id,
      },
      data: {
        name,
        description,
        schedule,
        on_diet: onDiet,
      }
    });

    return {
      meal: updatedMeal,
    }
  });

  app.delete('/:id', {
    preHandler: [checkSessionId]
  }, async (request, reply) => {
    const routeParamsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = routeParamsSchema.parse(request.params);

    await prisma.meal.delete({
      where: {
        id,
      }
    });

    return reply.status(204).send();
  });
}