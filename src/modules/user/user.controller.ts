import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { updateUserRequestSchema } from "../../schema/user.schema";
import userService from '../user/user.service';
import log from '../../util/logger';

class UserController {
  private extractUserIdFromToken(req: Request): string | null {
    // ดึง JWT token จาก Authorization
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return null;  // ถ้าไม่มี token
    }

    try {
      // ตรวจสอบและดึงข้อมูลจาก token
      const decoded: any = jwt.verify(token, 'secretKey');
      return decoded.userId;
    } catch (error) {
      log.error({ error: 'Invalid or expired token' });
      return null;
    }
  }

  async getUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.extractUserIdFromToken(req);
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const user = await userService.getUser(userId);
      res.status(200).json({ success: true, data: user });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message, error: 'Internal server error' });
      log.error({ error: error.message });
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.extractUserIdFromToken(req);
      const data = req.body;

      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const updatedUser = await userService.updateUser(userId, data);
      res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: updatedUser
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message, error: 'Internal server error' });
      log.error({ error: error.message });
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.extractUserIdFromToken(req);

      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      await userService.deleteUser(userId);
      res.status(200).json({
        success: true,
        message: 'User deleted successfully',
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message, error: 'Internal server error' });
      log.error({ error: error.message });
    }
  }
}

export default new UserController();