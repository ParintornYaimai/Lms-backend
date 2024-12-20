import { Types } from "mongoose";
import { z } from "zod";

export const assignmentSchema = z.object({
    homeworkId: z.array(z.instanceof(Types.ObjectId)).optional(),
    subject: z.string(),
    course: z.custom<Types.ObjectId>((val) => Types.ObjectId.isValid(val), {
        message: "Invalid ObjectId format for course",
    }),
    createdbyteacher: z.custom<Types.ObjectId>((val) => Types.ObjectId.isValid(val), {
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
    files: z.array(z.string()).optional(), 
    score: z.string().optional(),
    status: z.string().optional(),
    action: z.array(z.string())
});

// ใช้ Zod เพื่อดึงข้อมูลประเภท
export type CreateAssignment = z.infer<typeof assignmentSchema>;
