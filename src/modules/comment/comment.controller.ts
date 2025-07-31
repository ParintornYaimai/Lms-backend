import { Request, Response } from "express";
import { Types } from "mongoose";
import log from "../../util/logger";
import commentService from "./comment.service"


class commmentController{
    async create(req: Request, res: Response):Promise<void>{
        try {
            const {content, note} = req.body;
            const author = req.user.id;
            
            if(!note || typeof note !== 'string'){
                res.status(400).json({ success: false, message: 'Invalid note ID' });
                return;
            }
            const noteId = new Types.ObjectId(note);
            const data = await commentService.create({content, noteId, author})
            
            req.app.get('socketIO').emit('comment:create',data );
            res.status(200).json({success:true ,message:"Creation successful"});
        } catch (error:any) {
            res.status(500).json({success: false,message:error.message,error:'Internal server error'})
            log.error(error.message);
        }
    }

    async delete(req: Request, res: Response):Promise<void>{
        try {
            const id = req.params.id;
            const accountOwnerId = req.user.id;
            
            const data = await commentService.delete({id, accountOwnerId })
            req.app.get('socketIO').emit('comment:delete',data );
            res.status(200).json({success:true,message:'Delete successful'})
        } catch (error:any) {
            res.status(500).json({success: false,message:error.message,error:'Internal server error'})
            log.error(error.message);
        }
    }

}


export default new commmentController()