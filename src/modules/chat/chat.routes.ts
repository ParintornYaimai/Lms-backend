import express from 'express';
import chatController from '../chat/chat.controller'
import validate from '../../middleware/validateData';
import { addMemberInChatSchema, chatgroupSchema } from '../../schema/chat.schema';



const router = express.Router()

router.get('/getAllFriends',chatController.getAllFriends) //get all friends

router.get('/',chatController.getAll) // get all chat for owner account 
router.post('/createChat/:id',chatController.create) // create chat    
router.post('/createChatGroup',validate(chatgroupSchema),chatController.creategroup) // create chat group 
router.patch('/addMember',validate(addMemberInChatSchema),chatController.addMember)// add member for group
router.delete('/:id',chatController.delete) //delete chat
 

export default router;