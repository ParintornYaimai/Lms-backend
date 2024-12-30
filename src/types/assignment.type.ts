import { Types } from "mongoose";

export interface assignmentTypeModel extends Document{
    subject: Types.ObjectId
    course: Types.ObjectId;
    passpercen: number
    schedule: Date[]
    endDate: Date[]
    files: [{
        url: { type: String, required: true },       // ลิงก์หรือ path ของไฟล์
        name: { type: String, required: true },      // ชื่อไฟล์
        type: { type: String, enum: ["pdf", "doc", "image", "docx", "ppt", "pptx"], required: true },  // ประเภทของไฟล์
        size: { type: Number, required: true },      // ขนาดไฟล์ (อาจจะใช้หน่วย KB/MB)
    }]
    submissions: {   
        studentId: Types.ObjectId; 
        score: number;
        file: string[];
        status: 'not_submitted' | 'submitted' | 'graded' | 'overdue';
    }[];  
    score: number
    status: string
    action: string[]
}

export interface CreateAssignment {
    subject: string
    courseId: Types.ObjectId;
    passpercen: number
    schedule: Date[]
    endDate: Date[]
    files: Array<{
        url: string 
        name: string
        type: "pdf" | "doc" | "image" | "docx" | "ppt" | "pptx";
        size: number
    }>
    submissions: string[] 
    score?: number
    status?: string
    action: string[]
}

export interface UpdateScoreAssignment{
    assignmentId: string, 
    scores:[
        {
            studentId: string, 
            score: number
        }
    ]
   
}

// export interface assignmentResponse {
//     homeworkId?: Types.ObjectId[]
//     subject: Types.ObjectId
//     course: Types.ObjectId;
//     passpercen: number
//     schedule: Date[]
//     endDate: Date[]
//     files: string[]
//     submissions: Types.ObjectId[]
//     score: string
//     status: string
//     action: string[]
// }