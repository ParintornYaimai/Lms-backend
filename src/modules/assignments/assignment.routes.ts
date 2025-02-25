import express from 'express'
import assignmentController from './assignment.controller';
import  validate  from '../../middleware/validateData';
import { assignmentSchema, updateAssignmentSchema, updateScoreAssignmentSchema, createAssignmentForStudentSchema } from '../../schema/assignment.schema';
import { checkRole } from '../../middleware/checkRole';


const router = express.Router();

//student
router.get('/',checkRole(['student']),assignmentController.getAllSubmission) 
router.post('/',checkRole(['student']),validate(createAssignmentForStudentSchema),assignmentController.createSubmission) 


//teacher
router.get('/backoffice',checkRole(['teacher']),assignmentController.getAll) //get assignment by id and user id assignment  
router.post('/backoffice',checkRole(['teacher']),validate(assignmentSchema),assignmentController.create) //create assignment   
router.patch('/backoffice/:id',checkRole(['teacher']),validate(updateAssignmentSchema),assignmentController.update) //update assignment  

router.delete('/backoffice/:id',checkRole(['teacher']),assignmentController.delete) 

//score
router.get('/backoffice/result/:id',checkRole(['teacher']),assignmentController.getResult) //get user for update score 
router.patch('/backoffice',checkRole(['teacher']),validate(updateScoreAssignmentSchema),assignmentController.updateScore) //add Score 


export default router;






