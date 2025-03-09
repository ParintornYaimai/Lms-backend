import mongoose, { Schema } from "mongoose";
import { noteTypeModel } from "../types/note.type"


const noteSchemaModel = new Schema<noteTypeModel>({
    title: { type: String, required: true },
    tag: { type: String, required: true },
    description: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
}, { timestamps: true })

export const NoteModel = mongoose.model<noteTypeModel>('Note', noteSchemaModel);