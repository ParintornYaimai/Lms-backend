import mongoose, { Schema } from "mongoose";
import { CommentModelType } from "../types/comment.type";


const commentSchema = new Schema<CommentModelType>({
  content: { type: String, required: true },
  noteId: { type: Schema.Types.ObjectId, ref: "Note", required: true },
  author: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
}, { timestamps: true });

export const CommentModel = mongoose.model<CommentModelType>("Comment", commentSchema);