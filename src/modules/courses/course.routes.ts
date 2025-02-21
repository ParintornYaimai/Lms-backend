import express from 'express'
import { checkRole } from '../../middleware/checkRole';
import courseController from '../courses/course.controller'
import validate  from '../../middleware/validateData';
import {CreateCourseSchema, UpdateCourseSchema} from '../../schema/course.schema'

const router = express.Router();

//student
router.get('/',courseController.getAllForUser) //ดึงหน้าคอสทั้งหมดที่ลงทะเบียนเเล้ว
router.patch('/:id',courseController.startCourse)  // กด Launch Course
router.get('/getInProgressCourses/:courseId/:enrolledId',courseController.getInProgressCourses) // กด continue

//teacher 
router.get('/backoffice',checkRole(['teacher']),courseController.getAll); // ดึงคอสทั้งหมดที่ผู้ใช้สร้าง
router.post('/backoffice',checkRole(['teacher']),validate(CreateCourseSchema),courseController.create); //สร้างคอส
router.patch('/backoffice/:id',checkRole(['teacher']),validate(UpdateCourseSchema),courseController.update) //อัพเดทคอส
router.delete('/backoffice/:id',checkRole(['teacher']),courseController.delete) //ลบคอส
// cate
router.get('/backoffice-cate',checkRole(['teacher']),courseController.getCate) //ดึง category ตอนสร้างคอส
router.get('/backoffice-subcate/:id',checkRole(['teacher']),courseController.getSubCateById) //ดึงsubCategory ตอนสร้าคอส (ส่ง cate Id มา) 



export default router



    