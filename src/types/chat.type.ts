import mongoose, { Schema, Document } from "mongoose";

export interface chatTypeModel extends Document {
    sender: mongoose.Types.ObjectId;  
    receiver: mongoose.Types.ObjectId;  
    createdAt: Date;  
    updatedAt: Date;  
}


export interface ChatGroupTypeModel extends Document {
    people: {
        user: mongoose.Types.ObjectId;
    }[];
    createdAt: Date;
    updatedAt: Date;
}
