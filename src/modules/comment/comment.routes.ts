import express from 'express'
import commentRouter from './comment.controller'
import  validate  from '../../middleware/validateData';
import { createCommentSchema } from '../../schema/comment.schema';
import { checkRole } from '../../middleware/checkRole';
const router  = express.Router();


router.post('/',checkRole(['student']),validate(createCommentSchema),commentRouter.create);
router.delete('/:id',checkRole(['student']),commentRouter.delete)








export default router