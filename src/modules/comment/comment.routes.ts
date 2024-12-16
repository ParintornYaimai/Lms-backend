import express from 'express'
import commentRouter from './comment.controller'
import  validate  from '../../util/validate';
import { createCommentSchema } from '../../schema/comment.schema';
const router  = express.Router();


router.post('/comment',validate(createCommentSchema),commentRouter.create);
router.delete('/comment/:id',commentRouter.delete)








export default router