import express from 'express'
import assignmentController from './assignment.controller';
import  validate  from '../../middleware/validateData';
import { assignmentSchema, updateAssignmentSchema, updateScoreAssignmentSchema, createAssignmentForStudentSchema } from '../../schema/assignment.schema';
import { checkRole } from '../../middleware/checkRole';


const router = express.Router();

//student
router.get('/',assignmentController.getAllAssignment) 
router.post('/',checkRole(['student']),validate(createAssignmentForStudentSchema),assignmentController.sendAssignment) //ส่งการบ้าน


//teacher
router.get('/backoffice',checkRole(['teacher']),assignmentController.getAll) //ดึงassignment
router.get('/backoffice/:id',checkRole(['teacher']),assignmentController.getById) //ดึงassignment
router.post('/backoffice',checkRole(['teacher']),validate(assignmentSchema),assignmentController.create) //สร้าง
router.patch('/backoffice/:id',checkRole(['teacher']),validate(updateAssignmentSchema),assignmentController.update) //เเก้ไข

router.delete('/backoffice/:id',checkRole(['teacher']),assignmentController.delete) 

//score
router.get('/backoffice/result/:id',checkRole(['teacher']),assignmentController.getResult) //ดึงผู้ใช้ที่ส่งงาน
router.patch('/backoffice',checkRole(['teacher']),validate(updateScoreAssignmentSchema),assignmentController.updateScore) //ให้คะเเนน


export default router;






