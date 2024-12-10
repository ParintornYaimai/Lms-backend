import { Request, Response } from "express";
import log from "../../util/logger";
import noteService from "./note.service";
import { CreateNote, GetNoteByTag, UpdateNote, } from 'src/schema/note.sechema';


class noteController{

    async getAll(req: Request, res: Response){
        try {
            const data = await noteService.getAll();

            res.status(200).json({success: true,data});
        } catch (error:any) {
            res.status(500).json({success: false,message:error.message,error:'Internal server error'});
            log.error({error:error.message});
        }
    }
    async getById(req:Request, res:Response){
        try {

            const id = req.params.id
            const data = await noteService.getById(id)
            
            res.status(200).json({success:true ,data});
        } catch (error:any) {
            res.status(500).json({success: false,message:error.message,error:'Internal server error'});
            log.error({error:error.message});
        }
    }

    async getNoteByIdForAccountOwner(req: Request, res: Response){
        try {
            const {id} = (req as any).user;  
            const data = await noteService.getByIdForAccountId({id});

            res.status(200).json({success:true ,data});
        } catch (error:any) {
            res.status(500).json({success: false,message:error.message,error:'Internal server error'});
            log.error({error:error.message});
        }
    }

    //filter
    async getByTag(req: Request<{},{},GetNoteByTag>, res: Response){
        try {
            const {tag} = req.body;
            const data = await noteService.getByTag({tag});

            res.status(200).json({success:true ,data});
        } catch (error:any) {
            res.status(500).json({success: false,message:error.message,error:'Internal server error'});
            log.error({error:error.message});
        }
    }

    async create(req: Request<{},{},CreateNote>, res: Response){
        try {
            const {title, tag, description} = req.body;
            const {id} = (req as any).user;
            const data = await noteService.create({title, tag, description, id});

            res.status(200).json({success:true ,data});
        } catch (error:any) {
            res.status(500).json({success: false,message:error.message,error:'Internal server error'});
            log.error({error:error.message});
        }
    }

    async update(req: Request<{},{},UpdateNote>, res: Response){
        try {
            const {id, title, tag, description} = req.body;
            const {id:accountOwnerId} = (req as any).user;
            const data = await noteService.update({id, title, tag, description ,accountOwnerId});;

            res.status(200).json({success:true ,data});
        } catch (error:any) {
            res.status(500).json({success: false,message:error.message,error:'Internal server error'});
            log.error({error:error.message});
        }
    }

    async delete(req: Request, res: Response){
        try {
            const id = req.params.id
            const {id:accountOwnerId} = (req as any).user;
            const data = await noteService.delete({id,accountOwnerId});

            res.status(200).json({success:true, data})
        } catch (error:any) {
            res.status(500).json({success: false,message:error.message,error:'Internal server error'})
            log.error({error:error.message})
        }
    }
}

export default new noteController()