import { FastifyInstance } from "fastify";
import { userRoutes } from "./user.routes";
import { mealRoutes } from "./meal.routes";

export async function appRoutes(app: FastifyInstance) {
  app.register(userRoutes, {
    prefix: '/user'
  });
  app.register(mealRoutes, {
    prefix: '/meal'
  });
}