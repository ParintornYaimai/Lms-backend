import { Types } from "mongoose";

export interface TeacherModelType extends Document {
    firstname: string;
    lastname: string;
    email: string;
    role: string;
    phoneNumber: string;
    department: string;
    password: string;
    resetToken?: string;
    courses: Types.ObjectId[];  
    assignmentmentsId: Types.ObjectId[]; 
    profilepicture: string
    refreshTokens?: { token: string; expiresAt: Date }[];
}
  