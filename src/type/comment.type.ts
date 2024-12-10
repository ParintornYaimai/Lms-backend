import { Types } from "mongoose";

export interface CommentType {
  content: string; 
  post: Types.ObjectId; 
  author: Types.ObjectId; 
}