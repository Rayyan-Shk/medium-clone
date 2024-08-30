import { z } from "zod";

export const signupInputs = z.object({
    email: z.string().email(),
    password: z.string(),
    name: z.string().min(6)
})

export const signinInputs = z.object({
    email: z.string().email(),
    password: z.string().min(6)
})

export const blogsInputs = z.object({
  title: z.string(),
  content: z.string()  
})

export const updateBlogs = z.object({
    title: z.string(),
    content: z.string(),
    id: z.number()
})

export type signupInputs = z.infer<typeof signupInputs>
export type signinInputs = z.infer<typeof signinInputs>
export type blogsInputs = z.infer<typeof blogsInputs>
export type updateBlogs = z.infer<typeof updateBlogs>