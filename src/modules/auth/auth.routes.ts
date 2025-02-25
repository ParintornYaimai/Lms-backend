import express from 'express'
import { loginSchema, registerSchema, } from '../../schema/auth.sechema';
import  validate  from '../../middleware/validateData';
import authController from './auth.controller'
import {authenticateToken} from '../../middleware/authenticateToken'

const router = express.Router();

router.post('/sign-up',validate(registerSchema),authController.register);
router.post('/sign-in',validate(loginSchema),authController.login)
router.post('/sign-out',authenticateToken,authController.logout)

router.post('/sign-in-teacher',validate(registerSchema),authController.registerForTeacher)

router.post('/refresh-token',authenticateToken,authController.refreshtoken)

//forgot password
router.post('/sendOtp',authController.sendOtp)
router.post('/verifyOtp',authController.verifyOtp)
router.post('/reset-password',authController.resetPassword)

export default router;