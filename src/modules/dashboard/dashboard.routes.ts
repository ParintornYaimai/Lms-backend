import express from "express";
import dashboardController from './dashboard.controller'
import { checkRole } from "../../middleware/checkRole";


const router = express.Router();

router.get('/finishAssignment',checkRole(['student']),dashboardController.finishAssignment)
router.get('/latestDocuments',checkRole(['student']),dashboardController.latestDocuments)
router.get('/recentEnrolled',checkRole(['student']),dashboardController.recentEnrolled)
router.get('/taskprogress',checkRole(['student']),dashboardController.taskProgress)




export default router;