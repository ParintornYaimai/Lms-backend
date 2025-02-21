import { Types } from 'mongoose';
import { z } from 'zod';

export const chatgroupSchema = z.object({
    peopleId: z.array(z.string()).min(2, { message: "At least 2 participants are required" })
});

export const addMemberInChatSchema = z.object({
    groupChatId:z.custom<Types.ObjectId>((val) => Types.ObjectId.isValid(val), {
        message: "Invalid ObjectId format for Id",
    }),
    peopleId: z.array(z.custom<Types.ObjectId>((val) => Types.ObjectId.isValid(val), {
        message: "Invalid ObjectId format for Id",
    }),)  
});



export type addMemberInChat = z.infer<typeof addMemberInChatSchema>;
export type chatGroups = z.infer<typeof chatgroupSchema>;