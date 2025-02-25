import express from 'express';
import resourceController from './resource.controller';

const router = express.Router();

router.get('/',resourceController.getAll)

export default router;