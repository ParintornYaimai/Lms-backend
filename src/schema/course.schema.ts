import { number, z } from "zod";

const ContentSchema = z.object({
    id:z.number(),
    name: z.string(),
    contentType: z.enum(["file", "video"]), // ชื่อหัวข้อของ content
    contentValue: z.array(
        z.array(
            z.object({
            fileId: z.string(),
            fileUrl: z.string(),
            filename: z.string(),
            })
        )
    ).optional() 
});

const CourseCRMSchema = z.object({
    id: z.number(),
    name: z.string(),
    lectures: z.array(ContentSchema),
});

export const CreateCourseSchema = z.object({
    title: z.string().min(3, "Title is required."), 
    subtitle: z.string().min(3, "Subtitle is required."),
    coursecate: z.string().min(1, "Course category is required."),
    coursesubjectcate: z.string().min(1, "Course subject category is required."),
    coursetopic: z.string().min(1, "Course topic is required."),
    courselanguage: z.string().min(1, "courselanguage is required."),
    subtitlelanguage: z.string().min(1, "subtitlelanguage is required."),
    courselevel:z.string().min(1, "courselevel is required."),
    duration: z.number().min(1, "Duration must be at least 1 hour."),
    thumbnailurl: z.array(z.object({
        fileId: z.string(),
        filename: z.string(),
        fileUrl: z.string(),
    })).min(1, "required"),
    coursematerial: z.string().min(1, "Course material is required."),
    whatyouwillteachincourse: z.array(z.string()).min(1, "At least one main point is required."), 
    coursereq: z.array(z.string()).min(1, "At least one course requirement is required."), 
    whothiscourseisfor: z.array(z.string()).min(1, "At least one course requirement is required."), 
    coursecrm: z.array(CourseCRMSchema).optional(), 
    welmsg: z.string().optional().optional(),
    conmsg: z.string().optional().optional(),
});

export const UpdateCourseSchema = z.object({
    title: z.string().min(3, "Title is required.").optional(), 
    subtitle: z.string().min(3, "Subtitle is required.").optional(),
    coursecate: z.string().min(1, "Course category is required.").optional(),
    coursesubjectcate: z.string().min(1, "Course subject category is required.").optional(),
    coursetopic: z.string().min(1, "Course topic is required.").optional(),
    duration: z.number().min(1, "Duration must be at least 1 hour.").optional(), 
    thumbnailurl: z.string().url("Invalid URL for thumbnail.").optional(),
    coursematerial: z.string().min(1, "Course material is required.").optional(),
    mainpoint: z.array(z.string()).min(1, "At least one main point is required.").optional(), 
    coursereq: z.array(z.string()).min(1, "At least one course requirement is required.").optional(), 
    coursecrm: z.array(CourseCRMSchema).optional(), 
    welmsg: z.string().optional().optional(),
    conmsg: z.string().optional().optional(),
});

export type UpdateCourse = z.infer<typeof UpdateCourseSchema>;
export type CreateCourse = z.infer<typeof CreateCourseSchema>;

