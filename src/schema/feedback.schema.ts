import { Types } from "mongoose";
import { z } from "zod";


export const CreateFeedbackSchema = z.object({
    courseId: z.custom<Types.ObjectId>((val) => Types.ObjectId.isValid(val), {
        message: "Invalid ObjectId format for courseId",
    }),
    rating: z.number().min(1, "Rating must be between 1 and 5" ).max(5, "Rating must be between 1 and 5" ).optional(),
    text: z.string().optional(), 
});

export const UpdateFeedbackSchema = z.object({
    courseId: z.custom<Types.ObjectId>((val) => Types.ObjectId.isValid(val), {
        message: "Invalid ObjectId format for courseId",
    }),
    feedbackId:z.custom<Types.ObjectId>((val) => Types.ObjectId.isValid(val), {
        message: "Invalid ObjectId format for feedbackId",
    }),
    rating: z.number().min(1,"Rating must be between 1 and 5" ).max(5,"Rating must be between 1 and 5" ).optional(), 
    text: z.string().optional(),
});

export const DeleteFeedBackSchema = z.object({
    courseId: z.custom<Types.ObjectId>((val) => Types.ObjectId.isValid(val), {
        message: "Invalid ObjectId format for courseId",
    }),
    feedbackId:z.custom<Types.ObjectId>((val) => Types.ObjectId.isValid(val), {
        message: "Invalid ObjectId format for feedbackId",
    }),
});

export type DeleteFeedBack = z.infer<typeof DeleteFeedBackSchema>;
export type UpdateFeedBack = z.infer<typeof UpdateFeedbackSchema>;
export type CreateFeedback = z.infer<typeof CreateFeedbackSchema>;

 














