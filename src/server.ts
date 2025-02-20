import { fastifyCors } from "@fastify/cors";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import { fastify } from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import { usersRoute } from "./routes/users";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, { origin: "*" });

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "API com Fastify + TypeScript + Zod",
      version: "1.0.0",
    },
  },
  transform: jsonSchemaTransform,
});

app.get("/", async (request, reply) => {
  return reply.status(200).send({ message: "Hello World" });
});

app.register(usersRoute, { prefix: "/users" });

app.register(fastifySwaggerUi, { routePrefix: "/docs" });

app.listen({ port: 3333 }, () => {
  console.log("Server is running on port 3333");
});
