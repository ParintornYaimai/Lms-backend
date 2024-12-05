import {z} from "zod";

export const registerSchema = z.object({
    firstname: z.string().min(5,'A firstname must be specified and must be longer than 3 characters.'),
    lastname: z.string().min(5,'A lastname must be specified and must be longer than 3 characters.'),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8,"Password must be at least 8 characters long"),
    role: z.string().default('student'),
    courses: z.array(z.string()).optional(),
})

export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8,"Password must be at least 8 characters long")
})

export const logoutSchema = z.object({
    id: z.string(),
})

export type Register = z.infer<typeof registerSchema>;
export type Login = z.infer<typeof loginSchema>;
export type Logout = z.infer<typeof logoutSchema>;