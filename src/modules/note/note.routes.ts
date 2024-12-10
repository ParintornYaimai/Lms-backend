import express from 'express'
import  { createNoteSchema, getNoteByTagSchema, updateNoteSchema}  from '../../schema/note.sechema';
import  validate  from '../../util/validate';
import noteController from './note.controller';
import {authenticateToken} from '../../util/token'


const router = express.Router();



router.use(authenticateToken)
router.get('/notes',noteController.getAll)
router.get('/note/:id',noteController.getById)
router.get('/notes/me',noteController.getNoteByIdForAccountOwner)
router.get('/notes-filter',validate(getNoteByTagSchema),noteController.getByTag) //filter function
router.post('/notes',validate(createNoteSchema),noteController.create)
router.patch('/notes',validate(updateNoteSchema),noteController.update)
router.delete('/note/:id',noteController.delete)




export default router;