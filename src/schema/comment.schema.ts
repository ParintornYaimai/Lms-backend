import {z} from "zod";


export const createCommentSchema = z.object({
    note: z.string().min(1,"NoteId is required"),
    content: z.string().refine(val => val.trim().length > 0, {
        message: "Content is required", 
    }),
})


export type CreateComment = z.infer<typeof createCommentSchema>;
