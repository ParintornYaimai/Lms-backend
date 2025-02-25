import express from 'express';
import enrolledController from './enrolled.controller';
import { checkRole } from '../../middleware/checkRole';


const router = express.Router();

router.get('/',checkRole(['student']),enrolledController.getAll); //ดึงคอสทั้งหมดหน้า enrolle ที่ยังไม่ลงทะเบียน f
router.get('/cate',checkRole(['student']),enrolledController.getCate); //ดึง category เพื่อใช้ filter f
router.get('/subcate/:id',checkRole(['student']),enrolledController.getSubCate); // ดึง sub category เพื่อใช้ filter  f
router.get('/getCourseBySubCate/:id',checkRole(['student']),enrolledController.getCourseBySubCate); //ดึงคอสทั้งหมดจาก subcateId (filter function)  f
router.get('/:id',checkRole(['student']),enrolledController.getById) //ดึงรายละเอียดเเต่ละคอสเวลากดเข้าไปดู f
router.post('/:id',checkRole(['student']),enrolledController.enrolled); //ลงทะเบียนเรียน f

export default router;