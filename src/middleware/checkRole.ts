import { Request, Response, NextFunction } from "express";

// Middleware ตรวจสอบ Role
export const checkRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.headers["role"]; // รับ role จาก headers หรือ token ตามที่กำหนดไว้

    // ตรวจสอบว่า userRole มีค่าหรือไม่
    if (!userRole) {
      return res.status(401).json({ message: "Unauthorized: No role provided" });
    }

    // ตรวจสอบว่า userRole อยู่ใน allowedRoles หรือไม่
    if (!allowedRoles.includes(userRole.toString())) {
      return res.status(403).json({ message: "Forbidden: Access denied" });
    }

    next(); // ให้ผ่านไปยัง Controller ต่อไป
  };
};