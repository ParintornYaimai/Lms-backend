import { z } from "zod";

export const addFriendRequestSchema = z.object({
    fromuser: z.string().min(1, 'fromuser is required'),  
    toUserId: z.string().min(1, 'toUserId is required'), 
});

export type AddFriendRequest = z.infer<typeof addFriendRequestSchema>;
