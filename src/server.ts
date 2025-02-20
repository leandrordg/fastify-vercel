import { fastifyCors } from "@fastify/cors";
import { fastify } from "fastify";

const app = fastify();

app.register(fastifyCors, { origin: "*" });

app.get("/", async (request, reply) => {
  return reply.status(200).send({ message: "Hello World" });
});

app.listen({ port: 3333 }, () => {
  console.log("Server is running on port 3333");
});
