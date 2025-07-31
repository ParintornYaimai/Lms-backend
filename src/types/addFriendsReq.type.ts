import { Types } from "mongoose";

export interface addFriendsReq extends Document{
    fromUserId: Types.ObjectId; 
    toUserId: Types.ObjectId;
    status: "pending" | "accepted" ;
    createdAt?: Date; 
    updatedAt?: Date; 
}

export interface createReq {
    fromUserId: Types.ObjectId;
    toUserId: Types.ObjectId;
}







