import express from 'express'
import  { createNoteSchema, getNoteByTagSchema, updateNoteSchema}  from '../../schema/note.sechema';
import  validate  from '../../middleware/validateData';
import noteController from './note.controller';



const router = express.Router();


router.get('/',noteController.getAll)
router.get('/:id',noteController.getById)
router.get('/me',noteController.getNoteByIdForAccountOwner) //my note
router.get('/filter',validate(getNoteByTagSchema),noteController.getByTag) //filter function
router.post('/',validate(createNoteSchema),noteController.create)
router.patch('/',validate(updateNoteSchema),noteController.update)
router.delete('/:id',noteController.delete)




export default router;