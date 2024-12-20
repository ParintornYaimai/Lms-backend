import { Request, Response } from 'express';
import userService from '../user/user.service';
import log from '../../util/logger';

class userController {

  async getUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      
      const user = await userService.getUser(userId);

      res.status(200).json({ success: true, user });
    } catch (error: any) {
      res.status(500).json({success: false,message:error.message,error:'Internal server error'});
      log.error(error.message);
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const {firstname, lastname, welcomeMessage, language, dateFormat, timeFormat, country, timeZone, currentTime} = req.body;
      const userId = (req as any).user.id;

      const updatedUser = await userService.updateUser({userId, firstname, lastname, welcomeMessage, language, dateFormat, timeFormat, country, timeZone, currentTime});

      res.status(200).json({success: true, message: "User updated successfully"});
    } catch (error: any) {
      res.status(500).json({success: false,message:error.message,error:'Internal server error'});
      log.error(error.message);
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      console.log(userId);
      
      await userService.deleteUser(userId);

      res.status(200).json({success: true, message: 'User deleted successfully'});
    } catch (error: any) {
      res.status(500).json({success: false,message:error.message,error:'Internal server error'});
      log.error(error.message);
    }
  }
}

export default new userController();