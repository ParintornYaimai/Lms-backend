import { Types } from "mongoose";

export interface EnrolledTypeModel extends Document {
    student: Types.ObjectId;
    course: Types.ObjectId;
    enrollmentDate: Date;
    status?: 'not startd' |'active' | 'completed' | 'in-progress';
}

// service output - getCourseBySubCate
export interface  EnrolledCourseData {
    title: string;
    subtitle: string;
    coursecate: string;
    coursesubjectcate: string;
    thumbnailurl: string;
    studentCount: number;
    rating: number;
    createdAt: Date;
}