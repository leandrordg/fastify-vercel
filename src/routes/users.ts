import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";

export async function usersRoute(app: FastifyInstance) {
  // GET /users
  app.get("/", async (request, reply) => {
    const users = await prisma.user.findMany();

    return reply.status(200).send({
      success: true,
      data: users,
      message: "Users found successfully",
    });
  });

  // POST /users
  app.post("/", async (request, reply) => {
    const { name, email } = request.body as { name: string; email: string };

    const userExists = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (userExists)
      return reply
        .status(400)
        .send({ success: false, data: {}, message: "User already exists" });

    const user = await prisma.user.create({
      data: {
        name,
        email,
      },
    });

    return reply.status(201).send({
      success: true,
      data: user,
      message: "User created successfully",
    });
  });

  // GET BY ID /users/:id
  app.get("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      return reply
        .status(404)
        .send({ success: false, data: {}, message: "User not found" });
    }

    return reply
      .status(200)
      .send({ success: true, data: user, message: "User found successfully" });
  });

  // PUT /users/:id
  app.put("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const { name, email } = request.body as { name: string; email: string };

    const user = await prisma.user.update({
      where: {
        id,
      },
      data: {
        name,
        email,
      },
    });

    return reply.status(200).send({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  });

  // DELETE /users/:id
  app.delete("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };

    await prisma.user.delete({
      where: {
        id,
      },
    });

    return reply
      .status(204)
      .send({ success: true, data: {}, message: "User deleted successfully" });
  });
}
