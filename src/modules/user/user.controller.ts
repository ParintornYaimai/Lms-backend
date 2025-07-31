import { Request, Response } from 'express';
import userService from '../user/user.service';
import log from '../../util/logger';

class userController {

  async getUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user.id;
      
      const data = await userService.getUser(userId);

      req.app.get('socketIO').to(userId).emit('user:get',data );
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({success: false,message:error.message,error:'Internal server error'});
      log.error(error.message);
    }
  }

  async updateUser(req: Request, res: Response): Promise<void>{
    try {
      const {firstName, lastName, message, language, dateFormat, timeFormat, country, timeZone, profilePicture} = req.body;
      const userId = req.user.id;

      const data = await userService.updateUser({userId, firstName, lastName, message, language, dateFormat, timeFormat, country, timeZone, profilePicture});

      // console.log(data)
      req.app.get('socketIO').emit('user:update',data );
      res.status(200).json({success: true, message: "User updated successfully"});
    } catch (error: any) {
      res.status(500).json({success: false,message:error.message,error:'Internal server error'});
      log.error(error.message);
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user.id;
      
      const data = await userService.deleteUser(userId);

      req.app.get('socketIO').emit('user:delete',data );
      res.status(200).json({success: true, message: 'User deleted successfully'});
    } catch (error: any) {
      res.status(500).json({success: false,message:error.message,error:'Internal server error'});
      log.error(error.message);
    }
  }
}

export default new userController();