import { Types } from "mongoose";

export interface addFriendsReq extends Document{
    fromuser: Types.ObjectId; 
    toUserId: Types.ObjectId;
    status: "pending" | "accepted" ;
    createdAt?: Date; 
    updatedAt?: Date; 
}

export interface createReq {
    fromuser: Types.ObjectId;
    toUserId: Types.ObjectId;
}







