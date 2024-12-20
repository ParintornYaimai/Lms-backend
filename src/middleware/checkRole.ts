import { Request, Response, NextFunction } from "express";

// Middleware ตรวจสอบ Role
export const checkRole = (allowedRoles: [string]) => (req: Request, res: Response, next: NextFunction) => {
  const userRole = (req as any).user.role;

  if (!userRole) {
    return res.status(401).json({ message: "Unauthorized: No role provided" });
  }

  if (!allowedRoles.includes(userRole)) {
    return res.status(403).json({ message: "Forbidden: Access denied" });
  }

  next(); 
};