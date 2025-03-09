import { Request, Response } from "express";
import log from "../../util/logger";
import noteService from "./note.service";

class noteController{

    async getAll(req: Request, res: Response):Promise<void>{
        try {
            const data = await noteService.getAll();

            req.app.get('socketIO').emit('note:getAll',data );
            res.status(200).json({success: true,data});
        } catch (error:any) {
            res.status(500).json({success: false,message:error.message,error:'Internal server error'});
            log.error(error.message);
        }
    }

    async getById(req:Request, res:Response):Promise<void>{
        try {
            const id = req.params.id
            const data = await noteService.getById(id)
            
            req.app.get('socketIO').emit('note:getById',data );
            res.status(200).json({success:true ,data});
        } catch (error:any) {
            res.status(500).json({success: false,message:error.message,error:'Internal server error'});
            log.error(error.message);
        }
    }

    async getNoteByIdForAccountOwner(req: Request, res: Response):Promise<void>{
        try {
            const id = req.user.id;  
            const data = await noteService.getByIdForAccountId(id);

            req.app.get('socketIO').to(req.user.id).emit('note:getNoteByIdForAccountOwner',data );
            res.status(200).json({success:true ,data});
        } catch (error:any) {
            res.status(500).json({success: false,message:error.message,error:'Internal server error'});
            log.error(error.message);
        }
    }

    //filter
    async getByTag(req: Request, res: Response):Promise<void>{
        try {
            const {tag} = req.body;
            const data = await noteService.getByTag(tag);

            req.app.get('socketIO').to(req.user.id).emit('note:getByTag',data );
            res.status(200).json({success:true ,data});
        } catch (error:any) {
            res.status(500).json({success: false,message:error.message,error:'Internal server error'});
            log.error(error.message);
        }
    }

    async create(req: Request, res: Response):Promise<void>{
        try {
            const {title, tag, description} = req.body;
            const id = req.user.id;  
            const data = await noteService.create({title, tag, description, id});

            req.app.get('socketIO').to(req.user.id).emit('note:create',data );
            res.status(200).json({success:true ,message:"Creation successful"});
        } catch (error:any) {
            res.status(500).json({success: false,message:error.message,error:'Internal server error'});
            log.error(error.message);
        }
    }

    async update(req: Request, res: Response):Promise<void>{
        try {
            const {id, title, tag, description} = req.body;
            const userId = req.user.id;
            const data = await noteService.update({id, title, tag, description ,userId});;

            req.app.get('socketIO').emit('note:update',data );
            res.status(200).json({success:true ,message:"Creation successful"});
        } catch (error:any) {
            res.status(500).json({success: false,message:error.message,error:'Internal server error'});
            log.error(error.message);
        }
    }

    async delete(req: Request, res: Response):Promise<void>{
        try {
            const id = req.params.id
            const userId = req.user.id;
            const data = await noteService.delete(id,userId);

            req.app.get('socketIO').emit('note:delete',data );
            res.status(200).json({success:true,message:'Delete successful'})
        } catch (error:any) {
            res.status(500).json({success: false,message:error.message,error:'Internal server error'})
            log.error(error.message);
        }
    }
}

export default new noteController()