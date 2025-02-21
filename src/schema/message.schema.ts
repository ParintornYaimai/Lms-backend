import { Types } from "mongoose";
import { z } from "zod";

export const createMessageSchema = z.object({
    chatroom: z.custom<Types.ObjectId>((val) => Types.ObjectId.isValid(val), {
        message: "Invalid ObjectId format for chatroomId",
    }),
    receiver:z.custom<Types.ObjectId>((val) => Types.ObjectId.isValid(val), {
        message: "Invalid ObjectId format for receiver",
    }), 
    messageText: z.string(), 
    files: z.array(
        z.object({
        url: z.string().url("Invalid file URL"), 
        type: z.enum(["pdf", "doc", "docx", "ppt", "pptx", "jpg", "jpeg", "png"]), 
        size: z.number().optional(), 
        })
    ).optional(), 
});

export const updateMessageSchema = z.object({
    chatroom: z.custom<Types.ObjectId>((val) => Types.ObjectId.isValid(val), {
        message: "Invalid ObjectId format for chatroomId",
    }), 
    // receiver: z.custom<Types.ObjectId>((val) => Types.ObjectId.isValid(val), {
    //     message: "Invalid ObjectId format for senderId",
    // }), 
    messageText: z.string(), 
    files: z.array( 
        z.object({
        url: z.string().url("Invalid file URL"), 
        type: z.enum(["pdf", "doc", "docx", "ppt", "pptx", "jpg", "jpeg", "png"]), 
        size: z.number().optional(), 
        })
    ).optional(),
    action: z.string().optional(),
    status: z.string().optional(),
});


export const deleteMessageSchema = z.object({
    chatId: z.custom<Types.ObjectId>((val) => Types.ObjectId.isValid(val), {
        message: "Invalid ObjectId format for chatroomId",
    }), 
    messageId: z.custom<Types.ObjectId>((val) => Types.ObjectId.isValid(val), {
        message: "Invalid ObjectId format for senderId",
    }), 
 
});


export type deleteMessage = z.infer<typeof deleteMessageSchema>;
export type updateMessage = z.infer<typeof updateMessageSchema>;
export type createMessage = z.infer<typeof createMessageSchema>;
