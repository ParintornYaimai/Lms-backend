import express from 'express';
import chatController from '../chat/chat.controller'
import validate from '../../middleware/validateData';
import { addMemberInChatSchema, chatgroupSchema } from '../../schema/chat.schema';
import { checkRole } from '../../middleware/checkRole';



const router = express.Router()

router.get('/getAllFriends',checkRole(['student']),chatController.getAllFriends) //get all friends

router.get('/',checkRole(['student']),chatController.getAll) // get all chat for owner account 
router.post('/createChat/:id',checkRole(['student']),chatController.create) // create chat    
router.post('/createChatGroup',checkRole(['student']),validate(chatgroupSchema),chatController.creategroup) // create chat group 
router.patch('/addMember',checkRole(['student']),validate(addMemberInChatSchema),chatController.addMember)// add member for group
router.delete('/:id',checkRole(['student']),chatController.delete) //delete chat
 

export default router;