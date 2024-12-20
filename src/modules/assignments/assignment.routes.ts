import express from 'express'
import assignmentController from './assignment.controller';
import  validate  from '../../util/validate';
import { assignmentSchema } from '../../schema/assignment.schema';


const router = express.Router();

router.get('/assignment',assignmentController.getAll)
router.post('/assignment',validate(assignmentSchema),assignmentController.create)



export default router;