import { Types } from "mongoose";
import { z } from "zod";

export const assignmentSchema = z.object({
    subject: z.string(),
    courseId: z.custom<Types.ObjectId>((val) => Types.ObjectId.isValid(val), {
        message: "Invalid ObjectId format for course",
    }),
    passpercen: z.number()
        .min(0, "Pass percentage must be greater than or equal to 0")
        .max(100, "Pass percentage cannot exceed 100"), 
    schedule: z.array(z.date()).length(2, "Schedule must have exactly 2 dates").refine(dates => dates[0] < dates[1], {
        message: "The first date must be earlier than the second"
    }), 
    endDate: z.array(z.date()).length(2, "End date must have exactly 2 dates").refine(dates => dates[0] > dates[1], {
        message: "End date must be after the schedule's end date"
    }), 
    files: z.array(z.object({
        url: z.string().url(), // เช็คให้เป็น URL ที่ถูกต้อง
        name: z.string(),
        type: z.enum(["pdf", "doc", "image", "docx", "ppt", "pptx"]),  // เช็คประเภทไฟล์
        size: z.number().positive(), // ขนาดไฟล์ต้องเป็นจำนวนบวก
    })).default([]),
    submissions: z.array(z.string()),
    score:z.number().optional(),
    status: z.string().optional(),
    action: z.array(z.string()).default([])
});

export const getAllAssignmentSchema = z.object({
   
});

export const updateAssignmentSchema = z.object({
    assignmentId: z.string().refine((val) => Types.ObjectId.isValid(val), {
        message: "Invalid ObjectId format",  // ข้อความเมื่อไม่ตรงตามรูปแบบ
    }),
    scores: z.array(z.object({
        studentId: z.string(),
        score: z.number(),
    }))
});


// ใช้ Zod เพื่อดึงข้อมูลประเภท
export type CreateAssignment = z.infer<typeof assignmentSchema>;
export type GetAllAssignment = z.infer<typeof getAllAssignmentSchema>;
export type UpdateAssignment = z.infer<typeof updateAssignmentSchema>