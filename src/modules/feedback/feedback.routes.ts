import express from "express";
import validate from "../../middleware/validateData";
import feedbackController from "./feedback.controller";
import {CreateFeedbackSchema, DeleteFeedBackSchema, UpdateFeedbackSchema} from '../../schema/feedback.schema'

const router = express.Router();


router.get('/:id',feedbackController.getAll)
router.post('/',validate(CreateFeedbackSchema),feedbackController.create)
router.patch('/',validate(UpdateFeedbackSchema),feedbackController.updated)
router.delete('/',validate(DeleteFeedBackSchema),feedbackController.delete)

export default router;