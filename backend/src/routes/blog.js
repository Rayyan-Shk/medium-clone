import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { blogsInputs, updateBlogs } from "@rayyanrg/medium-back";
import { Hono } from "hono";
import { verify } from "hono/jwt";
export const blogRouter = new Hono();
blogRouter.use("/*", async (c, next) => {
    // get the header 
    // verify the header 
    // if the header is correct we head and process
    // if not we return the 403 error 
    const authHeader = c.req.header('authorization') || " ";
    const user = await verify(authHeader, c.env.JWT_SECRET);
    if (user) {
        c.set("userId", user.id);
        await next();
    }
    else {
        c.status(403);
        return c.json({
            error: "you are not authorized"
        });
    }
});
blogRouter.post('/', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    const body = await c.req.json();
    const authorId = c.get("userId");
    const { success } = blogsInputs.safeParse(body);
    if (!success) {
        c.status(411);
        return c.json({
            message: "invalid inputs while adding the blog"
        });
    }
    const blog = await prisma.blog.create({
        data: {
            title: body.title,
            content: body.content,
            authorId: Number(authorId)
        }
    });
    return c.json({
        id: blog.id
    });
});
blogRouter.put('/', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    const body = await c.req.json();
    const { success } = updateBlogs.safeParse(body);
    if (!success) {
        c.status(411);
        return c.json({
            error: "inputs error while updating the blog"
        });
    }
    const blog = await prisma.blog.update({
        where: {
            id: body.id
        },
        data: {
            title: body.title,
            content: body.content,
        }
    });
    return c.json({
        id: blog.id
    });
});
blogRouter.get('/bulk', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    const blogs = await prisma.blog.findMany({
        select: {
            id: true,
            title: true,
            content: true,
            author: {
                select: {
                    name: true
                }
            }
        }
    });
    return c.json({
        blogs
    });
});
blogRouter.get('/:id', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    const id = c.req.param("id");
    try {
        const blog = await prisma.blog.findFirst({
            where: {
                id: Number(id)
            },
            select: {
                id: true,
                title: true,
                content: true,
                author: {
                    select: {
                        name: true
                    }
                }
            }
        });
        return c.json({
            id: blog
        });
    }
    catch (e) {
        c.status(411);
        return c.json({
            message: "error while fetch the blog data "
        });
    }
});
