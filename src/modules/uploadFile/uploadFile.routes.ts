import express from 'express'
import uploadController from './uploadFile.controller';
import upload from '../../middleware/upload';
import validateFile from '../../middleware/validateFile'
import virusScanMiddleware from '../../middleware/virusScanMiddleware';

const router = express.Router();


router.post('/uploads',upload,virusScanMiddleware,validateFile,uploadController.create) 


export default router;