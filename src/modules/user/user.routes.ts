import express from 'express';
import userController from '../user/user.controller';
import validate from '../../util/validate';
import { updateUserRequestSchema } from '../../schema/user.schema';
import { checkRole } from '../../middleware/checkRole';

const router = express.Router();

// ดึงข้อมูลผู้ใช้
router.get('/', checkRole(['student', 'teacher']), userController.getUser);

// อัปเดตข้อมูลผู้ใช้
router.patch(
  '/update',
  checkRole(['student', 'teacher']),
  validate(updateUserRequestSchema),
  userController.updateUser
);

// ลบข้อมูลผู้ใช้
router.delete('/delete', checkRole(['student', 'teacher']), userController.deleteUser);

export default router;