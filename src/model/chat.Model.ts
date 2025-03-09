import mongoose, { Schema } from "mongoose";
import { chatTypeModel, ChatGroupTypeModel } from "../types/chat.type";

const chatSchema = new Schema<chatTypeModel>({
    sender: { type: Schema.Types.ObjectId, required: true, ref: "Student" },
    receiver: {type: Schema.Types.ObjectId, required: true, ref: "Student" },
}, { timestamps: true });

const chatGroupSchema = new Schema<ChatGroupTypeModel>({
    people: [{
        user: { type: Schema.Types.ObjectId, required: true, ref: "Student" },
    }]
}, { timestamps: true })


export const ChatModel = mongoose.model<chatTypeModel>("Chat", chatSchema);
export const ChatgroupModel = mongoose.model<ChatGroupTypeModel>("ChatGroup", chatGroupSchema);