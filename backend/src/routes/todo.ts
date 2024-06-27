import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { decode, sign, verify } from "hono/jwt";
import { createPostInput, updatePostInput } from "../../node_modules/@kr-vaibhav/blogging-website/dist/index";

export const todoRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  },
  Variables: {
    userId: string;
  }
}>();


// model Todo {
//     id        Int @id @default(autoincreament())
//     title     String
//     content   String
//     published Boolean @default(false)
//     authorId  Int
//     author    User    @relation(fields: [authorId], references: [id])
//   }

todoRouter.use('/*', async (c, next) => {
  const jwt = c.req.header("authorization") || "";

  try {

    console.log("Jwt token : ", jwt );

    if (!jwt) {
      c.status(403);
      return c.json({
        error: "unauthorized",
      });
    }

    const payload = await verify(jwt, c.env.JWT_SECRET);
    console.log("Payload : ", payload);

    if (!payload || !payload.id) {
      c.status(403);
      return c.json({
        error: "unauthorized",
      });
    }

    c.set("userId", payload.id);
    await next();
  } catch (error) {
    console.log("Authentication error");
    c.status(403);
    return c.json({ message: "Authentication failed" });
  }
});

todoRouter.post("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const userId = c.get('userId');
  console.log("userId : ", userId);

  const { success } = createPostInput.safeParse(body);
  if(!success){
    c.status(411);
    return c.json({
      message : "Inputs are not correct"
    })
  }

  if(!userId){
    c.status(400);
    return c.json({
      message : "Author Id is missing"
    });
  }

  try {
    const res = await prisma.todo.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: Number(userId),
      },
    });

    return c.json({
      id: res.id
    });
  } catch (e) {
    console.log(e);
    c.status(411);
    return c.json({
      message: "Error while creating a blog!",
    });
  } finally {
    await prisma.$disconnect();
  }
});

todoRouter.put("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const userId = c.get('userId');
  const { success } = updatePostInput.safeParse(body);
  if(!success){
    c.status(411);
    return c.json({
      message : "Inputs are not correct"
    })
  }

  try {
    const res = await prisma.todo.update({
      where: {
        id: body.id,
      },
      data: {
        title: body.title,
        content: body.content,
      },
    });

    return c.json({
      id: res.id
    })
  } catch (e) {
    console.log(e);
    c.status(411);
    return c.json({
      message: "Error while updating a blog!",
    });
  } finally {
    await prisma.$disconnect();
  }
});

todoRouter.get("/bulk", async (c) => {

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const res = await prisma.todo.findMany({
      select: {
        title: true,
        content: true,
        id: true,
        author:{
          select:{
            name: true
          }
        }
      }
    });

    return c.json({
      res
    });
  } catch (e) {
    console.log(e);
    c.status(411);
    return c.json({
      message: "Error while getting all the blogs!",
    });
  } finally {
    await prisma.$disconnect();
  }
});

todoRouter.get('/:id', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const id = c.req.param("id");

  try {
    const res = await prisma.todo.findFirst({
      where: {
        id: Number(id),
      },
      select:{
        id: true,
        title: true,
        content: true,
        author:{
          select:{
            name: true
          }
        }
      }
    });

    if(!res){
      return c.json({message: "Blog not found"},404);
    }

    return c.json({
      res
    });
  } catch (e) {
    console.log(e);
    c.status(500);
    return c.json({
      message: "Error while getting user specific blog!",
    });
  } finally {
    await prisma.$disconnect();
  }
});


