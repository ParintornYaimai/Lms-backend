import mongoose, { Schema } from "mongoose";
import { CourseModelType } from "../types/course.type";

const contentSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  contentType: { type: String, enum: ["file", "video"], required: true },
  contentValue: [[{
    fileId: { type: String, required: true },
    fileUrl: { type: String, required: true },
    filename: { type: String, required: true },
  }]]
});

const courseCRMSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  lectures: [contentSchema]
});

const courseSchema = new Schema<CourseModelType>({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  coursecate: { type: Schema.Types.ObjectId, required: true, ref: "Category" }, // รับ string ตาม Zod (ถ้าจะเก็บ ObjectId ต้องแปลงก่อน)
  coursesubjectcate: { type: Schema.Types.ObjectId, required: true , ref: "SubCategory" },
  coursetopic: { type: String, required: true },
  courselanguage: { type: String, required: true },
  subtitlelanguage: { type: String, required: true },
  courselevel: { type: String, required: true },
  duration: { type: Number, required: true },
  thumbnailurl: [{
    fileId: { type: String, required: true },
    filename: { type: String, required: true },
    fileUrl: { type: String, required: true }
  }],
  coursematerial: { type: String, required: true },
  whatyouwillteachincourse: [{ type: String, required: true }],
  coursereq: [{ type: String, required: true }],
  whothiscourseisfor: [{ type: String, required: true }],
  coursecrm: [courseCRMSchema],
  welmsg: { type: String },
  conmsg: { type: String },
  createby: { type: Schema.Types.ObjectId, required: true, ref: "Teacher" },
}, { timestamps: true });

export const CourseModel = mongoose.model<CourseModelType>("Course", courseSchema);
