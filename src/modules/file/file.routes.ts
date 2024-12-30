import express from 'express'
import uploadController from './file.controller';
import upload from '../../middleware/upload';
import validateFile from '../../middleware/validateFile'
import virusScanMiddleware from '../../middleware/virusScanMiddleware';

const router = express.Router();


router.post('/uploads',upload,virusScanMiddleware,validateFile,uploadController.create) 
router.get('/download/:id',uploadController.getById) 

export default router;