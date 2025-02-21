import mongoose, { Schema } from "mongoose";
import {MessageTypeModel} from "../types/message.type";

const messageSchema = new Schema<MessageTypeModel>({
    chatroom: {type: Schema.Types.ObjectId, ref:"Chat", required: true},
    sender:{ type: Schema.Types.ObjectId, ref: "User", required: true},
    receiver:{ type: Schema.Types.ObjectId, ref: "User", required: true},
    messageText:{ type: String , required: true},
    files:[{
        url: { type: String, required: true },
        type: { type: String, enum: ["pdf", "doc", "docx", "ppt", "pptx", "jpg", "jpeg", "png"], required: true },
        size: { type: Number }  // ขนาดไฟล์ KB/MB
    }],
    actions:{ type: String},
    status:{type: String, default:"unread"},
}, { timestamps: true });

export const MessageModel = mongoose.model<MessageTypeModel>("Message", messageSchema);