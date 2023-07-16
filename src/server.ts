import fastify from "fastify";
import cookie from '@fastify/cookie';
import { env } from "./env";
import { appRoutes } from "./http/routes";

const app = fastify();

app.register(cookie);

app.register(appRoutes);

app.listen({
  port: env.PORT,
  host: '0.0.0.0',
}, () => {
  console.log(`Daily Diet Online on ${env.PORT}`)
});