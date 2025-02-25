import express from "express";
import dashboardController from './dashboard.controller'
import { checkRole } from "../../middleware/checkRole";


const router = express.Router();


router.get('/',checkRole(['student']),dashboardController.finishAssignment)





export default router;