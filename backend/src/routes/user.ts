import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { decode, sign, verify } from "hono/jwt";
import { signinInput } from "@kr-vaibhav/blogging-website/dist/index";
import { signupInput } from "../../node_modules/@kr-vaibhav/blogging-website/dist/index";

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

userRouter.post("/signup", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const { success, error } = signupInput.safeParse(body);
  if(!success){
    c.status(411);
    return c.json({
      message : "Inputs are not correct",
      error : error.format()
    })
  }

  try {
    const newUser = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
        name: body.name,
      },
    });

    const userId = newUser.id;

    const jwt = await sign(
      {
        id: newUser.id,
      },
      c.env.JWT_SECRET
    );

    return c.text(jwt);
  } catch (err) {
    c.status(500);
    console.log(err);
    return c.json({message: "error while signin up!", error : err});
  } finally {
    await prisma.$disconnect();
  }
});

userRouter.post("/signin", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const { success } = signinInput.safeParse(body);
  if(!success){
    c.status(411);
    return c.json({
      message : "Inputs are not correct"
    })
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        email: body.email,
        password: body.password,
      },
    });

    if (!user) {
      c.status(403);
      return c.json({
        error: "user not found!",
      });
    }

    // const decoded = await verify(token,c.env.JWT_SECRET);

    const jwt = await sign(
      {
        id: user.id,
      },
      c.env.JWT_SECRET
    );

    return c.text(jwt);
  } catch (e) {
    c.status(411);
    return c.text("error while signin !");
  } finally {
    await prisma.$disconnect();
  }
});
