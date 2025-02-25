import {Request, Response} from 'express'
import log from "../../util/logger";
import CourseService from '../courses/course.service'


class CourseController{
    
    //student
    async getAllForUser(req: Request, res: Response): Promise<void>{
        try {      
            const data = await CourseService.getAllForUser(req.user.id)
            
            req.app.get('socketIO').to(req.user.id).emit('course:getAllForUser',data );
            res.status(200).json({success: true, data})
        }catch(error: any){
            res.status(500).json({success: false,message:error.message,error:'Internal server error'})
            log.error(error.message);
        }
    }

    async startCourse(req: Request, res: Response): Promise<void>{
        try {
            const data = await CourseService.startCourse(req.params.id,req.user.id)

            req.app.get('socketIO').to(req.user.id).emit('course:startCourse',data );
            res.status(200).json({success: true, data})
        }catch(error: any){
            res.status(500).json({success: false,message:error.message,error:'Internal server error'})
            log.error(error.message);
        }
    }
    
    async getInProgressCourses(req: Request, res: Response): Promise<void>{
        try {
            const data = await CourseService.getInProgressCourses(req.user.id, req.params.courseId, req.params.enrolledId);

            req.app.get('socketIO').to(req.user.id).emit('course:getInProgressCourses',data );
            res.status(200).json({success: true, data})
        }catch(error: any) {
            res.status(500).json({success: false, message:error.message,error:'Internal server error'})
            log.error(error.message);
        }
    }
    
    //teacher
    async getAll(req: Request, res: Response): Promise<void>{
        try {
            const data = await CourseService.getAll(req.user.id);

            req.app.get('socketIO').to(req.user.id).emit('course:getAll',data );
            res.status(200).json({success: true, data});
        }catch(error: any){
            res.status(500).json({success: false,message:error.message,error:'Internal server error'})
            log.error(error.message);
        }
    }

    async create(req: Request, res: Response): Promise<void>{
        try {
            const data = await CourseService.create(req.body,req.user.id);
            
            req.app.get('socketIO').to(req.user.id).emit('course:create',data );
            res.status(200).json({success: true, data});
        }catch(error: any){
            res.status(500).json({success: false,message:error.message,error:'Internal server error'})
            log.error(error.message);
        }
    }

    async update(req: Request, res: Response): Promise<void>{
        try {
            
            const data = await CourseService.update(req.body, req.params.id, req.user.id);

            req.app.get('socketIO').to(req.user.id).emit('course:update',data );
            res.status(200).json({success: true, data})
        }catch(error: any){
            res.status(500).json({success: false,message:error.message,error:'Internal server error'})
            log.error(error.message);
        }
    }
        
    async delete(req: Request, res: Response): Promise<void>{
        try {
            const data = await CourseService.delete(req.params.id, req.user.id)

            req.app.get('socketIO').to(req.user.id).emit('course:delete',data );
            res.status(200).json({success: true, data})
        }catch(error: any){
            res.status(500).json({success: false,message:error.message,error:'Internal server error'})
            log.error(error.message);
        }
    }

    async getCate(req: Request, res: Response): Promise<void>{
        try {
            const data = await CourseService.getCate()

            req.app.get('socketIO').to(req.user.id).emit('course:getCate',data );
            res.status(200).json({success: true, data})
        } catch (error: any) {
            res.status(500).json({success: false,message:error.message,error:'Internal server error'})
            log.error(error.message);
        }
    }

    async getSubCateById(req: Request, res: Response): Promise<void>{
        try {
            const data = await CourseService.getSubCateById(req.params.id)

            req.app.get('socketIO').to(req.user.id).emit('course:getSubCateById',data );
            res.status(200).json({success: true, data})
        } catch (error: any) {
            res.status(500).json({success: false,message:error.message,error:'Internal server error'})
            log.error(error.message);
        }
    }
}

export default new CourseController();  