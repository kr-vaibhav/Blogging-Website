import { z } from "zod";

export const signupInput= z.object({
    email : z.string().email(),
    password : z.string().min(6,{message:"Password should be of minimum length 6"}),
    name : z.string().optional()
})

export const signinInput= z.object({
    email : z.string().email(),
    password : z.string().min(6,{message:"Password should be of minimum length 6"}),
})

export const createPostInput = z.object({
    title: z.string(),
    content: z.string(),
})


export const updatePostInput = z.object({
    title : z.string().optional(),
    content: z.string().optional(),

})


export type signupInput = z.infer<typeof signupInput>;
export type signinInput = z.infer<typeof signinInput>;
export type createPostInput = z.infer<typeof createPostInput>;
export type updatePostInput = z.infer<typeof updatePostInput>;