import { Types } from "mongoose";

export interface File {
    url: string;
    type: "pdf" | "doc" | "docx" | "ppt" | "pptx" | "jpg" | "jpeg" | "png";
    size: number;  // ขนาดไฟล์ใน KB หรือ MB
}

export interface SubmissionTypeModel {
    assignmentId: Types.ObjectId;  
    studentId: Types.ObjectId;     
    score: number;           
    files: File[];           
    status: 'Pending'|'Submitted'|'Overdue'; 
    submissionDate: Date;    
    createdAt: Date;        
    updatedAt: Date;        
}
export interface createSubmissionTypeModel {
    assignmentId: Types.ObjectId;  
    studentId: Types.ObjectId;           
    files: File[];           
}

export interface updateScoreInSubmission{
    assignmentId: string;
    updates:[{
      studentId: Types.ObjectId;
      score: number;
    }];
}