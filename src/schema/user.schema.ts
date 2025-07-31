import { z } from "zod";

export const updateUserSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  message: z.string().optional(),
  language: z.string().min(2).optional(),
  dateFormat: z.string().optional(),
  timeFormat: z.string().optional(),
  country: z.string().optional(),
  timeZone: z.string().optional(),
  currentTime: z.string().optional(),
  profilePicture: z.string().optional(),
});

export type UpdateUserRequest = z.infer<typeof updateUserSchema>;
