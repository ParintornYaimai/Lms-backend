import { Types } from "mongoose";

export interface TeacherModelType extends Document {
    firstname: string;
    lastname: string;
    email: string;
    role: string;
    phoneNumber: string;
    department: string;
    username: string;
    password: string;
    resetToken?: string;
    courses: Types.ObjectId[];  
    assignedAssignments: Types.ObjectId[]; 
    profilepicture: string
    refreshTokens?: { token: string; expiresAt: Date }[];
}
  