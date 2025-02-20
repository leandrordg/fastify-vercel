import { z } from "zod";
import { prisma } from "../lib/prisma";
import { FastifyTypedInstance } from "../types";

export async function usersRoute(app: FastifyTypedInstance) {
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
  app.post(
    "/",
    {
      schema: {
        body: z.object({
          name: z.string(),
          email: z.string().email({ message: "Invalid email" }),
        }),
      },
    },
    async (request, reply) => {
      const { name, email } = request.body;

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
    }
  );

  // GET BY ID /users/:id
  app.get(
    "/:id",
    {
      schema: {
        params: z.object({
          id: z.string().cuid({ message: "Invalid ID" }),
        }),
      },
    },
    async (request, reply) => {
      const { id } = request.params;

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

      return reply.status(200).send({
        success: true,
        data: user,
        message: "User found successfully",
      });
    }
  );

  // PUT /users/:id
  app.put(
    "/:id",
    {
      schema: {
        params: z.object({
          id: z.string().cuid({ message: "Invalid ID" }),
        }),
        body: z.object({
          name: z.string(),
          email: z.string().email({ message: "Invalid email" }),
        }),
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const { name, email } = request.body;

      const userExists = await prisma.user.findFirst({
        where: {
          email,
          NOT: {
            id,
          },
        },
      });

      if (userExists)
        return reply
          .status(400)
          .send({ success: false, data: {}, message: "User already exists" });

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
    }
  );

  // DELETE /users/:id
  app.delete(
    "/:id",
    {
      schema: {
        params: z.object({
          id: z.string().cuid({ message: "Invalid ID" }),
        }),
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      const userExists = await prisma.user.findUnique({
        where: {
          id,
        },
      });

      if (!userExists)
        return reply
          .status(404)
          .send({ success: false, data: {}, message: "User not found" });

      await prisma.user.delete({
        where: {
          id,
        },
      });

      return reply.status(200).send({
        success: true,
        data: {},
        message: "User deleted successfully",
      });
    }
  );
}
