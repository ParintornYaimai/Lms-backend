import express from 'express'
import commentRouter from './comment.controller'
import  validate  from '../../middleware/validateData';
import { createCommentSchema } from '../../schema/comment.schema';
const router  = express.Router();


router.post('/',validate(createCommentSchema),commentRouter.create);
router.delete('/:id',commentRouter.delete)








export default router