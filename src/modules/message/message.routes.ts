import express from 'express'
import messageController from './message.controller';
import validate  from '../../middleware/validateData';
import { updateMessageSchema, createMessageSchema, deleteMessageSchema } from '../../schema/message.schema';
import { checkRole } from '../../middleware/checkRole';


const router = express.Router();


router.get('/:id',checkRole(['student']),messageController.getAll) //get message
router.post('/',checkRole(['student']),validate(createMessageSchema),messageController.create) //create message       nt
router.patch('/',checkRole(['student']),validate(updateMessageSchema),messageController.edit) //edit message , create action         nt
router.delete('/',checkRole(['student']),validate(deleteMessageSchema),messageController.delete) //delete message       nt



export default router;

