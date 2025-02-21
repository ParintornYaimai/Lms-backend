import express from 'express';
import addFriends from '../addfriend/addfriends.controller'
import validate from '../../middleware/validateData';
import { addFriendRequestSchema } from '../../schema/addFriend.schema';

const router = express.Router()

router.get('/search',addFriends.search) // search user   
router.get('/getAll',addFriends.getAll) // get all req friends    
router.post('/sendReq',validate(addFriendRequestSchema),addFriends.create) //add friends    
router.patch('/acceptReq/:id',addFriends.update) //accept req      
router.delete('/cancleReq/:id',addFriends.delete) // Cancel request      






export default router;