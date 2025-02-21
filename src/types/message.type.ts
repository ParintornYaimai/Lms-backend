import mongoose, { Schema, Types } from "mongoose";

export interface IFile {
    url: string;
    type: "pdf" | "doc" | "docx" | "ppt" | "pptx" | "jpg" | "jpeg" | "png";
    size?: number;
}

export interface MessageTypeModel {
    chatroom: Types.ObjectId; 
    sender: Types.ObjectId;  
    receiver: Types.ObjectId;  
    messageText: string;
    files?: IFile[];       
    actions?: string;
    status?: "unread" | "read"; 
    createdAt: Date;
    updatedAt: Date;
}


export interface createMessage{
    chatroom: Types.ObjectId; 
    sender: Types.ObjectId;  
    receiver: Types.ObjectId; 
    messageText: string;
    files?: IFile[];   
}

export interface editMessage{
    chatroom: Types.ObjectId; 
    messageId: Types.ObjectId; 
    sender: Types.ObjectId;  
    messageText?: string;
    actions?: string;
    status?: string;
}

export interface deleteMessage{
    chatId: Types.ObjectId; 
    messageId: Types.ObjectId;  
    sender: string; 
}