import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { signinInputs, signupInputs } from "@rayyanrg/medium-back";
import { Hono } from "hono";
import { sign } from "hono/jwt";
export const userRouter = new Hono();
userRouter.post('/signup', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    const body = await c.req.json();
    const { success } = signupInputs.safeParse(body);
    if (!success) {
        c.status(411);
        return c.json({
            error: "Your Inputs are incorrect"
        });
    }
    const user = await prisma.user.create({
        data: {
            email: body.email,
            password: body.password
        },
    });
    const token = await sign({ id: user.id }, c.env.JWT_SECRET);
    return c.json({
        jwt: token
    });
});
userRouter.post('/signin', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    const body = await c.req.json();
    const { success } = signinInputs.safeParse(body);
    if (!success) {
        c.status(411);
        return c.json({
            error: "your inputs are incorrect"
        });
    }
    const user = await prisma.user.findUnique({
        where: {
            email: body.email,
            password: body.password
        }
    });
    if (!user) {
        c.status(411);
        return c.json({
            error: "user doesn't exist"
        });
    }
    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
    return c.json({ jwt });
});
