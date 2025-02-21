import { Types } from "mongoose";

export interface AssignmentTypeModel extends Document {
    title: string
    courseId: Types.ObjectId;  
    passpercen: number; 
    date: {
        start: Date;  
        end: Date;    
    };
    files: FileDetails[];    
    totalmark: number;  
    status:  'Pending'|'Submitted'|'Overdue';   
}
//-----------------------------------------------------------------------------------------------

type FileDetails = {
    url: string;
    name: string;
    type: "pdf" | "doc" | "docx" | "ppt" | "pptx" | "jpg" | "jpeg" | "png"; 
    size: number;
};

export interface ICourseDocument extends Document {
    createby: Types.ObjectId;
}
