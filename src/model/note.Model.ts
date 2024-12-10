import mongoose, { Schema } from "mongoose";
import {noteTypeModel} from "../type/note.type"


const noteSchemaModel = new Schema<noteTypeModel>({
    title:{ type: String, required: true},
    tag:{ type: String, required: true},
    description:{ type: String, required: true},
    author: { type: Schema.Types.ObjectId, ref: "User", required: true }, 
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
},{timestamps:true})

export const noteModel = mongoose.model<noteTypeModel>('Note', noteSchemaModel);