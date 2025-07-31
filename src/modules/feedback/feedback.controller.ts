import { Request, Response } from "express";
import feedBackService from '../feedback/feedback.service'
import log from "../../util/logger";


class feedBackController {
    
    async getAll(req: Request, res: Response){
        try{
            const data = await feedBackService.getAll(req.params.id);
           
            req.app.get('socketIO').emit('feedBack:getAll',data );
            res.status(200).json({success: true, data});
        }catch(error: any){
            res.status(500).json({success: false,message:error.message,error:'Internal server error'})
            log.error(error.message);
        }
    }

    async create(req: Request, res: Response){
        try{
            const data = await feedBackService.create(req.user.id, req.body);

            req.app.get('socketIO').emit('feedBack:create',data );
            res.status(200).json({success: true, data});
        }catch(error: any){
            res.status(500).json({success: false,message:error.message,error:'Internal server error'})
            log.error(error.message);
        }
    }

    async updated(req: Request, res: Response){
        try{
            const data = await feedBackService.updated(req.body, req.user.id)
           
            req.app.get('socketIO').to(req.user.id).emit('feedBack:updated',data );
            res.status(200).json({success: true, data});
        }catch(error: any){
            res.status(500).json({success: false,message:error.message,error:'Internal server error'})
            log.error(error.message);
        }
    }
    
    async delete(req: Request, res: Response){
        try{
            const data = await feedBackService.delete(req.body, req.user.id)
           
            req.app.get('socketIO').to(req.user.id).emit('feedBack:delete',data );
            res.status(200).json({success: true, data});
        }catch(error: any){
            res.status(500).json({success: false,message:error.message,error:'Internal server error'})
            log.error(error.message);
        }
    }
}

export default new feedBackController();