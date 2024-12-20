import { Types } from "mongoose";

export interface homeworkTypeModel extends Document{
    student: Types.ObjectId
    subject: Types.ObjectId
    course: Types.ObjectId;
    files: string[]
}


