import { Types } from "mongoose";
import { z } from "zod";

export const assignmentSchema = z.object({
    title: z.string().min(5,"title is required"),
    courseId: z.string().refine((val) => Types.ObjectId.isValid(val), {
        message: "Invalid ObjectId format", 
    }),
    passpercen: z.number()
        .min(0, "Pass percentage must be greater than or equal to 0")
        .max(100, "Pass percentage cannot exceed 100"), 
    date: z.object({start: z.string(), end: z.string(),}).refine((dates) => dates.start < dates.end, {
        message: "Start date must be before end date",
    }),
    files: z.array(z.object({
        url: z.string().url(), 
        name: z.string(),
        type: z.enum(["pdf", "doc", "docx", "ppt", "pptx", "jpg", "jpeg", "png"]),
        size: z.number(), 
    })).default([]),
    totalmark: z.number().refine((val) => val >= 1 && val <= 100, {
        message: "Total marks must be between 1 and 100",
    }),
    status: z.enum(["Pending", "Progress", "Done", "Overdue"]).default("Pending"),
});

export const updateAssignmentSchema = z.object({
    title: z.string().min(5,"title is required").optional(),
    passpercen: z.number()
        .min(0, "Pass percentage must be greater than or equal to 0")
        .max(100, "Pass percentage cannot exceed 100").optional(), 
    date: z.object({start: z.string(), end: z.string(),}).refine((dates) => dates.start < dates.end, {
        message: "Start date must be before end date",
    }).optional(),
    files: z.array(z.object({
        url: z.string().url(), 
        name: z.string(),
        type: z.enum(["pdf", "doc", "docx", "ppt", "pptx", "jpg", "jpeg", "png"]),
        size: z.number(), 
    })).default([]).optional(),
    totalmark: z.number().refine((val) => val >= 1 && val <= 100, {
        message: "Total marks must be between 1 and 100",
    }).optional(),
    status: z.enum(["Pending", "Progress", "Done", "Overdue"]).default("Pending").optional(),
});


export const createAssignmentForStudentSchema = z.object({
    // courseId: z.string().refine((val) => Types.ObjectId.isValid(val), {
    //     message: "Invalid ObjectId format", 
    // }),
    assignmentId: z.string().refine((val) => Types.ObjectId.isValid(val), {
        message: "Invalid ObjectId format", 
    }),
    files: z.array(z.object({
        fileId: z.string(),
        filename: z.string(),
        fileUrl: z.string()
    })).default([]),
});

export const updateScoreAssignmentSchema = z.object({
    assignmentId: z.string().refine((val) => Types.ObjectId.isValid(val), {
        message: "Invalid ObjectId format",  
    }),
    updates: z.array(z.object({
        studentId: z.string(),
        score: z.number(),
    }))
});


// ใช้ Zod เพื่อดึงข้อมูลประเภท
export type CreateAssignment = z.infer<typeof assignmentSchema>;
export type Assignment = z.infer<typeof createAssignmentForStudentSchema>;
export type UpdateAssignment = z.infer<typeof updateAssignmentSchema>
export type UpdateScoureAssignment = z.infer<typeof updateScoreAssignmentSchema>