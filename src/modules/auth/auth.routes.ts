import express from 'express'
import { loginSchema, logoutSchema, registerSchema, } from '../../schema/auth.sechema';
import  validate  from '../../middleware/validateData';
import authController from './auth.controller'
// import { upload } from '../../../config/cloudinary';
import {authenticateToken} from '../../middleware/authenticateToken'

const router = express.Router();

router.post('/sign-up',validate(registerSchema),authController.register);
router.post('/sign-in',validate(loginSchema),authController.login)
router.post('/sign-out',validate(logoutSchema),authenticateToken,authController.logout)

router.post('/refresh-token',authenticateToken,authController.refreshtoken)




export default router;