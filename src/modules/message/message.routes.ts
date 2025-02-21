import express from 'express'
import messageController from './message.controller';
import validate  from '../../middleware/validateData';
import { updateMessageSchema, createMessageSchema, deleteMessageSchema } from '../../schema/message.schema';


const router = express.Router();


router.get('/:id',messageController.getAll) //get message
router.post('/',validate(createMessageSchema),messageController.create) //create message       nt
router.patch('/',validate(updateMessageSchema),messageController.edit) //edit message , create action         nt
router.delete('/',validate(deleteMessageSchema),messageController.delete) //delete message       nt



export default router;

