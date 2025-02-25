import express from 'express';
import resourceController from './resource.controller';
import { checkRole } from '../../middleware/checkRole';

const router = express.Router();

router.get('/',checkRole(['student']),resourceController.getAll)

export default router;