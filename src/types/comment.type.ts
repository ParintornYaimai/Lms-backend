import { Types } from "mongoose";

export interface CommentModelType extends Document {
  content: string;
  noteId: Types.ObjectId; 
  author: Types.ObjectId; 
  createdAt: Date;
  updatedAt: Date;
}
export interface createCommentType {
  content: string; 
  noteId: Types.ObjectId; 
  author: Types.ObjectId; 
}

export interface DeleteCommentType{
  id: string
  accountOwnerId:string
}