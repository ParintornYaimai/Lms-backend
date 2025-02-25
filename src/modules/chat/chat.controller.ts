import { Request, Response } from "express";
import chatService from "./chat.service";
import log from "../../util/logger";

class chatController{

    async getAllFriends(req: Request, res: Response){
        try {
            const myFriends = await chatService.getAllFriends(req.user.id)

            req.app.get('socketIO').to(req.user.id).emit('chat:getAllFriends',myFriends );
            res.status(200).json({success: true,myFriends})
        } catch (error: any) {
            res.status(500).json({success: false,message:error.message,error:'Internal server error'});
            log.error(error.message);
        }
    }

    async getAll(req: Request, res: Response){
        try {
            const chatData = await chatService.getAll(req.user.id)
            
            req.app.get('socketIO').to(req.user.id).emit('chat:getAll',chatData );
            res.status(200).json({success: true,chatData})
        } catch (error: any) {
            res.status(500).json({success: false,message:error.message,error:'Internal server error'});
            log.error(error.message);
        }
    }

    async create(req: Request, res: Response){
        const receiver = req.params.id;
        try {
            const chatData = await chatService.create(req.user.id,receiver)
            
            req.app.get('socketIO').to(req.user.id).emit('chat:create',chatData );
            res.status(200).json({success: true,chatData})
        } catch (error: any) {
            res.status(500).json({success: false,message:error.message,error:'Internal server error'});
            log.error(error.message);
        }
    }
    
    async creategroup(req: Request, res: Response){
        const peopleId = req.body.peopleId
        try {
            const chatData = await chatService.creategroup(peopleId)
            
            req.app.get('socketIO').to(req.user.id).emit('chat:creategroup',chatData );
            res.status(200).json({success: true,chatData})
        } catch (error: any) {
            res.status(500).json({success: false,message:error.message,error:'Internal server error'});
            log.error(error.message);
        }
    }

    async addMember(req: Request, res: Response){
        const {groupChatId, peopleId} = req.body;
        try {
            const chatData = await chatService.addMember(groupChatId, peopleId)
            
            req.app.get('socketIO').to(req.user.id).emit('chat:addMember',chatData );
            res.status(200).json({success: true,chatData})
        } catch (error: any) {
            res.status(500).json({success: false,message:error.message,error:'Internal server error'});
            log.error(error.message);
        }
    }

      
    async delete(req: Request, res: Response){
        const chatId = req.params.id;
        const userId = req.user.id
        try {
            const chatData = await chatService.delete(chatId, userId)
            
            req.app.get('socketIO').to(req.user.id).emit('chat:delete',chatId );
            res.status(200).json({success: true,chatId})
        } catch (error: any) {
            res.status(500).json({success: false,message:error.message,error:'Internal server error'});
            log.error(error.message);
        }
    }

}

export default new chatController();