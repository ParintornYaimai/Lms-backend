import mongoose, { Schema } from "mongoose";
import { CourseModelType } from "../types/course.type";

const baseContentSchema = new mongoose.Schema(
  { type: { type: String, enum: ["text", "file", "video"], required: true } },
  { discriminatorKey: "type" }
);

const textSchema = new mongoose.Schema({
  content: { type: String, required: true }
});

const pdfSchema = new mongoose.Schema({
  size: { type: Number, required: true },
  url: { type: String, required: true }
});

const videoSchema = new mongoose.Schema({
  url: { type: String, required: true }
});

const courseCRMBase = mongoose.model("CourseCRM", baseContentSchema);
courseCRMBase.discriminator("text", textSchema);
courseCRMBase.discriminator("pdf", pdfSchema);
courseCRMBase.discriminator("video", videoSchema);

const courseSchema = new Schema<CourseModelType>({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  coursecate: { type: Schema.Types.ObjectId, required: true, ref: "Category" },
  coursesubjectcate: { type: Schema.Types.ObjectId, required: true ,ref: "SubCategory"},
  coursetopic: { type: String, require: true },
  duration: { type: Date, required: true },
  thumbnailurl: { type: String, require: true },
  coursematerial: { type: String, required: true },
  mainpoint: [{ type: String, required: true }],
  coursereq: [{ type: String, required: true }],
  coursecrm: [{
    section: {
      sectionname: { type: String, required: true },
      content: [baseContentSchema]
    }
  }],
  createby: { type: Schema.Types.ObjectId, ref: "Teacher" },
  assignment: [{ type: Schema.Types.ObjectId, ref: "Assignment" }],
}, { timestamps: true });



export const CourseModel = mongoose.model<CourseModelType>("Course", courseSchema); 