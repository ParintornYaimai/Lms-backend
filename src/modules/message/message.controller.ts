import { Request, Response } from "express";
import messageService from "./message.service";
import log from "../../util/logger";



class messageController {

    async getAll(req: Request, res: Response){
        const chatId = req.params.id;
        const userId = req.user.id;
        try {
            const message = await messageService.getAll(chatId, userId)

            req.app.get('socketIO').to(chatId).emit('message:getAll',message );
            res.status(200).json(message)
        } catch (error: any) {
            res.status(500).json({success: false,message:error.message,error:'Internal server error'});
            log.error(error.message);
        }
    }

    async create(req: Request, res: Response){
        const {chatroom, receiver, messageText, files} = req.body;
        const sender = req.user.id;
        try {
            const message = await messageService.create({chatroom, sender,receiver, messageText, files})
            
            req.app.get('socketIO').to(chatroom).emit('message:create',message );
            res.status(200).json(message)
        } catch (error: any) {
            res.status(500).json({success: false,message:error.message,error:'Internal server error'});
            log.error(error.message);
        }
    }

    async edit(req: Request, res: Response){
        const {chatroom, messageId, messageText, actions, status} = req.body;
        const sender = req.user.id
        try {
            const message = await messageService.edit({chatroom, messageId,sender, messageText, actions, status});

            req.app.get('socketIO').to(chatroom).emit('message:edit',message );
            res.status(200).json(message)
       } catch (error: any) {
           res.status(500).json({success: false,message:error.message,error:'Internal server error'});
           log.error(error.message);
       }
    }

    async delete(req: Request, res: Response){
        const {chatId, messageId} = req.body;
        const sender = req.user.id;
        try {
            const message = await messageService.delete({chatId, messageId, sender})

            req.app.get('socketIO').to(chatId).emit('message:delete',message );
            res.status(200).json(message)
       } catch (error: any) {
           res.status(500).json({success: false,message:error.message,error:'Internal server error'});
           log.error(error.message);
       }
    }
}

export default new messageController();