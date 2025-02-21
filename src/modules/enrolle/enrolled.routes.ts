import express from 'express';
import enrolledController from './enrolled.controller';


const router = express.Router();

router.get('/',enrolledController.getAll); //ดึงคอสทั้งหมดหน้า enrolle ที่ยังไม่ลงทะเบียน f
router.get('/cate',enrolledController.getCate); //ดึง category เพื่อใช้ filter f
router.get('/subcate/:id',enrolledController.getSubCate); // ดึง sub category เพื่อใช้ filter  f
router.get('/getCourseBySubCate/:id',enrolledController.getCourseBySubCate); //ดึงคอสทั้งหมดจาก subcateId (filter function)  f
router.get('/:id',enrolledController.getById) //ดึงรายละเอียดเเต่ละคอสเวลากดเข้าไปดู f
router.post('/:id',enrolledController.enrolled); //ลงทะเบียนเรียน f

export default router;