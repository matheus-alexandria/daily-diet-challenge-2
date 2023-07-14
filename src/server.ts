import fastify from "fastify";
import { env } from "./env";

const app = fastify();

app.listen({
  port: env.PORT,
  host: '0.0.0.0',
}, () => {
  console.log('Server Daily Diet Online')
});