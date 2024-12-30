import express from 'express'
import assignmentController from './assignment.controller';
import  validate  from '../../util/validate';
import { assignmentSchema, updateAssignmentSchema } from '../../schema/assignment.schema';
import { checkRole } from '../../middleware/checkRole';


const router = express.Router();

//student
router.get('/assignments',assignmentController.getAlls) 
router.post('/assignment',assignmentController.creates) //send homework



//teacher
router.get('/backoffice/:id',checkRole(['teacher']),assignmentController.getById) //get assignment by id and user id assignment
router.post('/backoffice',checkRole(['teacher']),validate(assignmentSchema),assignmentController.create) //create assignment
router.patch('/backoffice',checkRole(['teacher']),validate(updateAssignmentSchema),assignmentController.update) //add Score
router.delete('/backoffice/:id',checkRole(['teacher']),assignmentController.delete) //delete assignment



export default router;