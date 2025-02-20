import { fastifyCors } from "@fastify/cors";
import { fastify } from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import { usersRoute } from "./routes/users";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, { origin: "*" });

app.get("/", async (request, reply) => {
  return reply.status(200).send({ message: "Hello World" });
});

app.register(usersRoute, { prefix: "/users" });

app.listen({ port: 3333 }, () => {
  console.log("Server is running on port 3333");
});
