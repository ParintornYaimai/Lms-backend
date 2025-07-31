import {z} from "zod";

export const createNoteSchema = z.object({
    title: z.string().min(5,"Please enter a title longer than 5 characters"),
    tag: z.string().refine(val => val.trim().length > 0, { message: "Tag must not be empty or whitespace only",}),
    description: z.string().refine(val => val.trim().length > 0, {
        message: "Description is required", 
    }),
})


export const updateNoteSchema = z.object({
    id: z.string(),
    title: z.string().min(3,"Please enter a title longer than 5 characters").optional(),
    tag: z.string().refine(val => val.trim().length > 0, { message: "Tag must not be empty or whitespace only",}).optional(),
    description: z.string().refine(val => val.trim().length > 0, {
        message: "Description is required",
    }).optional(),
})

export type CreateNote = z.infer<typeof createNoteSchema>;
export type UpdateNote = z.infer<typeof updateNoteSchema>
