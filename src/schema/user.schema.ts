import { z } from "zod";

// export const userSchema = z.object({
//   userId: z.number(),
//   name: z.string().min(1),
//   welcomeMessage: z.string(),
//   language: z.string().min(2),
//   dateFormat: z.string(),
//   timeFormat: z.string(),
//   country: z.string(),
//   timeZone: z.string(), 
//   currentTime: z.string(),
// });

export const updateUserSchema = z.object({
  firstname: z.string().min(1).optional(),
  lastname: z.string().min(1).optional(),
  welcomeMessage: z.string().optional(),
  language: z.string().min(2).optional(),
  dateFormat: z.string().optional(),
  timeFormat: z.string().optional(),
  country: z.string().optional(),
  timeZone: z.string().optional(),
  currentTime: z.string().optional(),
});

// export type User = z.infer<typeof userSchema>;
export type UpdateUserRequest = z.infer<typeof updateUserSchema>;
