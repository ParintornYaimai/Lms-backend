import { Request, Response } from "express";
import log from "../../util/logger";
import enrolledService from "./enrolled.service";
import mongoose from "mongoose";


class enrolledController {
    
    async getCate(req: Request, res: Response): Promise<void>{
        try{
            const data = await enrolledService.getCate();

            res.status(200).json({success: true, data})
        }catch(error: any){
            res.status(500).json({success: false,message:error.message,error:'Internal server error'})
            log.error(error.message);
        }
    }

    async getSubCate(req: Request, res: Response): Promise<void>{
        try {
            const data = await enrolledService.getSubCate(req.params.id);

            res.status(200).json({success: true, data})
        } catch (error: any) {
            res.status(500).json({success: false,message:error.message,error:'Internal server error'})
            log.error(error.message);
        }
    }
    
    async getAll(req: Request, res: Response): Promise<void>{
        try {
            const data = await enrolledService.getCourseBySubCate();
            
            res.status(200).json({success: true, data});
        }catch(error: any){
            res.status(500).json({success: false,message:error.message,error:'Internal server error'})
            log.error(error.message);
        }
    }

    //ส่ง subcateId มา
    async getCourseBySubCate(req: Request, res: Response): Promise<void>{
        try {
            // const filter = { coursesubjectcate: req.params.id };
            const newObjId = new mongoose.Types.ObjectId(req.params.id)
            const data = await enrolledService.getCourseBySubCate(newObjId)
            
            res.status(200).json({success: true, data})
        } catch (error: any) {
            res.status(500).json({success: false,message:error.message,error:'Internal server error'})
            log.error(error.message);
        }
    }
    
    async getById(req: Request, res: Response): Promise<void>{
        try {
            const data = await enrolledService.getById(req.params.id);
            
            res.status(200).json({success: true, data});
        }catch(error: any){
            res.status(500).json({success: false,message:error.message,error:'Internal server error'})
            log.error(error.message);
        }
    }

    async enrolled(req: Request, res: Response): Promise<void>{
        try {
            const data = await enrolledService.enrolled(req.params.id, req.user.id);
            
            res.status(200).json({success: true, data});
        }catch(error: any){
            res.status(500).json({success: false,message:error.message,error:'Internal server error'})
            log.error(error.message);
        }
    }
}

export default new enrolledController();