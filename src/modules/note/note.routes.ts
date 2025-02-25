import express from 'express'
import  { createNoteSchema, getNoteByTagSchema, updateNoteSchema}  from '../../schema/note.sechema';
import  validate  from '../../middleware/validateData';
import noteController from './note.controller';
import { checkRole } from '../../middleware/checkRole';



const router = express.Router();


router.get('/',checkRole(['student']),noteController.getAll)
router.get('/:id',checkRole(['student']),noteController.getById)
router.get('/me',checkRole(['student']),noteController.getNoteByIdForAccountOwner) //my note
router.get('/filter',checkRole(['student']),validate(getNoteByTagSchema),noteController.getByTag) //filter function
router.post('/',checkRole(['student']),validate(createNoteSchema),noteController.create)
router.patch('/',checkRole(['student']),validate(updateNoteSchema),noteController.update)
router.delete('/:id',checkRole(['student']),noteController.delete)




export default router;