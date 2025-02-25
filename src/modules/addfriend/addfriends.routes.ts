import express from 'express';
import addFriends from '../addfriend/addfriends.controller'
import validate from '../../middleware/validateData';
import { addFriendRequestSchema } from '../../schema/addFriend.schema';
import { checkRole } from '../../middleware/checkRole';

const router = express.Router()

router.get('/search',checkRole(['student']),addFriends.search) // search user   
router.get('/getAll',checkRole(['student']),addFriends.getAll) // get all req friends    
router.post('/sendReq',checkRole(['student']),validate(addFriendRequestSchema),addFriends.create) //add friends    
router.patch('/acceptReq/:id',checkRole(['student']),addFriends.update) //accept req      
router.delete('/cancleReq/:id',checkRole(['student']),addFriends.delete) // Cancel request      






export default router;