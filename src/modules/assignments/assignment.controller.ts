import { Request, Response } from "express";
import log from "../../util/logger";
import assignmentService from '../../modules/assignments/assignment.service'
import { CreateAssignment } from "src/schema/assignment.schema";


class assignmentController{
    //user 
    //หาการบ้านทั้งหมดของผู้ใช้ที่ login
    async getAlls(req: Request, res: Response):Promise<void>{ 
        try {
            const page = parseInt(req.query.page as string) || 1; 
            const limit = parseInt(req.query.limit as string) || 10; 
            const data = await assignmentService.getAlls(limit, page);

            req.app.get('socketIO').emit('assignment:getall',data );
            res.status(500).json({success: true, data});
        } catch (error: any) {
            res.status(500).json({success: false,message:error.message,error:'Internal server error'})
            log.error(error.message);
        }
    }
    
    //ส่งการบ้าน
    async creates(req: Request, res: Response):Promise<void>{
        try {
            
        } catch (error: any) {
            res.status(500).json({success: false,message:error.message,error:'Internal server error'})
            log.error(error.message);
        }
    }

    //teacher
    // ดูคอสไอดี
    async getById(req: Request<{id: string},{},{},{}>, res: Response):Promise<void>{
        try {
            const assignmentId = req.params.id;
            const teacherId = req.user.id;
            const data = await assignmentService.getById(assignmentId,teacherId);

            req.app.get('socketIO').emit('assignment:getById',data );
            res.status(200).json({success: true, data});
        } catch (error: any) {
            res.status(500).json({success: false,message:error.message,error:'Internal server error'})
            log.error(error.message);
        }
    }

    //สร้างการบ้าน
    async create(req: Request<{},{},CreateAssignment>, res: Response):Promise<void>{
        try {
            const {subject ,courseId, passpercen, schedule, endDate, files, submissions, score, status, action} = req.body;
            const data = await assignmentService.create({subject, courseId, passpercen, schedule, endDate, files, submissions, score,status, action});
            
            res.status(200).json({success: true, data})
        } catch (error: any) {
            res.status(500).json({success: false,message:error.message,error:'Internal server error'})
            log.error(error.message);
        }
    }

    //ให้คะเเนน
    async update(req: Request, res: Response):Promise<void>{
        try {
            const { assignmentId, scores} = req.body; //scores: [studentid, score]
            const data = await assignmentService.update({assignmentId, scores})

            req.app.get('socketIO').emit('assignment:update',data );
            res.status(200).json({success: true, data})
        } catch (error: any) {
            res.status(500).json({success: false,message:error.message,error:'Internal server error'})
            log.error(error.message);
        }
    }

    async delete(req: Request, res: Response):Promise<void>{
        try {
            const assignmentId = req.params.id;
            const teacherId = req.user.id;
            const data = await assignmentService.delete(assignmentId,teacherId)

            req.app.get('socketIO').emit('assignment:delete',data );
            res.status(200).json({success: true, data})
        } catch (error: any) {
            res.status(500).json({success: false,message:error.message,error:'Internal server error'})
            log.error(error.message);
        }
    }
    

}

export default new assignmentController();


