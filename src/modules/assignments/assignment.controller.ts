import { Request, Response } from "express";
import log from "../../util/logger";
import assignmentService from '../../modules/assignments/assignment.service'
import { assignmentSchema, CreateAssignment } from "src/schema/assignment.schema";
import {convertToObjectIdArray} from "../../util/helper"


class assignmentController{
    
    async getAll(req: Request, res: Response):Promise<void>{ 
        try {
            const data = await assignmentService.getAll();

            res.status(500).json({success: true, data});
        } catch (error: any) {
            res.status(500).json({success: false,message:error.message,error:'Internal server error'})
            log.error(error.message);
        }
    }

    async create(req: Request<{},{},CreateAssignment>, res: Response):Promise<void>{
        try {
            const {homeworkId, createdbyteacher,subject , course, passpercen, schedule, endDate, files, score, status, action} = req.body;
            const data = await assignmentService.create({homeworkId, createdbyteacher,subject , course, passpercen, schedule, endDate, files, score, status, action});
            
            res.status(200).json({success: true, data})
        } catch (error: any) {
            res.status(500).json({success: false,message:error.message,error:'Internal server error'})
            log.error(error.message);
        }
    }
}

export default new assignmentController();


