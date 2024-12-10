import mongoose, { Schema } from "mongoose";
import { CommentType } from "src/type/comment.type";


const commentSchema = new Schema<CommentType>({
  content: { type: String, required: true },
  post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

export const CommentModel = mongoose.model<CommentType>("Comment", commentSchema);