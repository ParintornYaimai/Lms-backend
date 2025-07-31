import express from 'express'
import  { createNoteSchema, updateNoteSchema}  from '../../schema/note.sechema';
import  validate  from '../../middleware/validateData';
import noteController from './note.controller';
import { checkRole } from '../../middleware/checkRole';
import cacheMiddleware from '../../middleware/cache'



const router = express.Router();

// cacheMiddleware('note'),
router.get('/',checkRole(['student']),noteController.getAll)
router.get('/myNote',checkRole(['student']),noteController.getNoteByIdForAccountOwner) //my note
router.get('/filter',checkRole(['student']),noteController.getByTag) //filter function
router.get('/:id',checkRole(['student']),noteController.getById)
router.post('/create',checkRole(['student']),validate(createNoteSchema),noteController.create)
router.patch('/',checkRole(['student']),validate(updateNoteSchema),noteController.update)
router.delete('/:id',checkRole(['student']),noteController.delete)




export default router;