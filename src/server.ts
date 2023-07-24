import fastify from "fastify";
import cookie from '@fastify/cookie';
import { env } from "./env";
import { appRoutes } from "./http/routes";
import { ZodError } from "zod";

const app = fastify();

app.register(cookie);

app.register(appRoutes);

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    reply.status(400).send({
      error: 'Zod validation error',
      issues: error.format(),
    });
  }

  reply.status(500).send({
    error: 'Unknown error.'
  })
});

app.listen({
  port: env.PORT,
  host: '0.0.0.0',
}, () => {
  console.log(`Daily Diet Online on ${env.PORT}`)
});