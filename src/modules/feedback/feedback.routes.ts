import express from "express";
import validate from "../../middleware/validateData";
import feedbackController from "./feedback.controller";
import {CreateFeedbackSchema, DeleteFeedBackSchema, UpdateFeedbackSchema} from '../../schema/feedback.schema'
import { checkRole } from "../../middleware/checkRole";
import cacheMiddleware from "../../middleware/cache";

const router = express.Router();

// ,cacheMiddleware('feedback')
router.get('/:id',checkRole(['student']),feedbackController.getAll)
router.post('/',checkRole(['student']),validate(CreateFeedbackSchema),feedbackController.create)
router.patch('/',checkRole(['student']),validate(UpdateFeedbackSchema),feedbackController.updated)
router.delete('/',checkRole(['student']),validate(DeleteFeedBackSchema),feedbackController.delete)

export default router;