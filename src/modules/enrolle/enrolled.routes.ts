import express from 'express';
import enrolledController from './enrolled.controller';
import { checkRole } from '../../middleware/checkRole';
import cacheMiddleware from '../../middleware/cache'

const router = express.Router();

router.get('/',checkRole(['student']),cacheMiddleware('enrolle'),enrolledController.getAll); //ดึงคอสทั้งหมดหน้า enrolle ที่ยังไม่ลงทะเบียน 
router.get('/cate',cacheMiddleware('cate'),enrolledController.getCate); //ดึง category เพื่อใช้ filter 
router.get('/subcate/:id',cacheMiddleware('subcate'),enrolledController.getSubCate); // ดึง sub category เพื่อใช้ filter  
// router.get('/getCourseBySubCate/:id',checkRole(['student']),cacheMiddleware('enrolle'),enrolledController.getCourseBySubCate); //ดึงคอสทั้งหมดจาก subcateId (filter function)  
router.get('/:id',checkRole(['student']),enrolledController.getById) //ดึงรายละเอียดเเต่ละคอสเวลากดเข้าไปดู 
router.post('/:id',checkRole(['student']),enrolledController.enrolled); //ลงทะเบียนเรียน 

export default router;