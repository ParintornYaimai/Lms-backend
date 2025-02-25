import { Request, Response } from "express";
import log from "../../util/logger";
import assignmentTeacherService from './teacherAssignment.service'
import studentAssignment from './studentAssignment.service'

class assignmentController{
    //student 
    async getAllSubmission(req: Request, res: Response):Promise<void>{ 
        try {
            const page = parseInt(req.query.page as string) || 1; 
            const limit = parseInt(req.query.limit as string) || 10; 
            
            const data = await studentAssignment.getAll(limit, page, req.params.id, req.user.id);
            
            req.app.get('socketIO').emit('assignment:getAllSubmission',data );
            res.status(500).json({success: true, data});
        } catch (error: any) {
            res.status(500).json({success: false,message:error.message,error:'Internal server error'})
            log.error(error.message);
        }
    }
    
    //ส่งการบ้านs
    async createSubmission(req: Request, res: Response):Promise<void>{
        try {
            const {assignmentId, files } = req.body;
            const studentId = req.user.id;
            const data = await studentAssignment.create({assignmentId, studentId, files});

            req.app.get('socketIO').to(studentId).emit('assignment:createSubmission',data );
            res.status(200).json({ success: true, data})
        } catch (error: any) {
            res.status(500).json({success: false,message:error.message,error:'Internal server error'})
            log.error(error.message);
        }
    }
//---------------------------------------------------------------------------------------------------------------------
    //teacher
    
    async getAll(req: Request, res: Response):Promise<void>{
        try {
            const data = await assignmentTeacherService.getAll(req.user.id);

            req.app.get('socketIO').to(req.user.id).emit('assignment:getAll',data );
            res.status(200).json({success: true, data});
        } catch (error: any){
            res.status(500).json({success: false,message:error.message,error:'Internal server error'})
            log.error(error.message);
        }
    }
    
    async getResult(req: Request, res: Response):Promise<void>{
        try {
            const data = await assignmentTeacherService.getResult(req.params.id ,req.user.id);

            req.app.get('socketIO').to(req.user.id).emit('assignment:getResult',data );
            res.status(200).json({success: true, data});
        } catch (error: any){
            res.status(500).json({success: false,message:error.message,error:'Internal server error'})
            log.error(error.message);
        }
    }

    //สร้างการบ้าน
    async create(req: Request, res: Response):Promise<void>{
        try {
            const data = await assignmentTeacherService.create(req.body);
            
            req.app.get('socketIO').to(req.user.id).emit('assignment:create',data );
            res.status(200).json({success: true, data})
        } catch (error: any) {
            res.status(500).json({success: false,message:error.message,error:'Internal server error'})
            log.error(error.message);
        }
    }

    async update(req: Request, res: Response):Promise<void>{
        try {
            const data = await assignmentTeacherService.updateAssignment(req.params.id, req.body, req.user.id)

            req.app.get('socketIO').to(req.user.id).emit('assignment:update',data );
            res.status(200).json({success: true, data})
        } catch (error: any) {
            res.status(500).json({success: false,message:error.message,error:'Internal server error'})
            log.error(error.message);
        }
    }

    //ให้คะเเนน
    async updateScore(req: Request, res: Response):Promise<void>{
        try {
            const data = await assignmentTeacherService.updateScore(req.body,req.user.id);

            req.app.get('socketIO').to(req.user.id).emit('assignment:updateScore',data );
            res.status(200).json({success: true, data})
        } catch (error: any) {
            res.status(500).json({success: false,message:error.message,error:'Internal server error'})
            log.error(error.message);
        }
    }

    async delete(req: Request, res: Response):Promise<void>{
        try {
            const data = await assignmentTeacherService.delete(req.params.id, req.user.id)

            req.app.get('socketIO').to(req.user.id).emit('assignment:delete',data );
            res.status(200).json({success: true, data})
        } catch (error: any) {
            res.status(500).json({success: false,message:error.message,error:'Internal server error'})
            log.error(error.message);
        }
    }

}

export default new assignmentController();


