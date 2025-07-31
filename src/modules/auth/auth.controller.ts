import { Request, Response } from 'express';
import authService from './auth.service';
import log from '../../util/logger';


class authController{

    async register(req: Request, res: Response):Promise<void>{
        try {
            const {firstname, lastname, email, password} = req.body;
            await authService.create({firstname, lastname, email, password});

            res.status(201).json({success: true,message: 'register successfully'});
        } catch (error:any) {
            res.status(500).json({success: false,message:error.message,error:'Internal server error'})
            log.error(error.message);
        }
    }

    async registerForTeacher(req: Request, res: Response):Promise<void>{
        try {
            const {firstname, lastname, email, password} = req.body;
            await authService.createForTeacher({firstname, lastname, email, password});

            res.status(201).json({success: true,message: 'register successfully'});
        } catch (error:any) {
            res.status(500).json({success: false,message:error.message,error:'Internal server error'})
            log.error(error.message);
        }
    }

    async login(req: Request, res: Response):Promise<void>{ 
        try {

            const {email,password} = req.body;
            const {accessToken,refreshToken} = await authService.login({email,password});
            res.cookie('refresh_token', refreshToken, {
                httpOnly: true, 
                secure: false, 
                sameSite: 'strict', 
                maxAge: 7 * 24 *60 * 60 * 1000 
            });

            res.status(200).json({success: true, access_token: accessToken});
        } catch (error:any) {
            res.status(500).json({success: false,message:error.message,error:'Internal server error'})
            log.error(error.message);
        }
    }
    
    async logout(req: Request, res: Response):Promise<void>{
        try {
            const id = req.user.id;
            const refresh_token = req.cookies.refresh_token;
            await authService.loggout({id,refresh_token});

            res.clearCookie('refresh_token', {
                httpOnly: true, 
                secure: false, 
                sameSite: 'strict', 
            });
            res.status(200).json({success: true, message: 'Logged out successfully' });
            
        } catch (error: any) {
            res.status(500).json({success: false,message:error.message,error:'Internal server error'})
            log.error(error.message);
        }
    }

    async refreshtoken(req: Request, res: Response):Promise<void>{
        try {
            const refreshTokenInput  = req.cookies.refresh_token; 
            
            const newAccessToken  = await authService.refreshToken(refreshTokenInput)
            res.status(200).json({ access_token: newAccessToken })
        } catch (error:any) {
            res.status(500).json({success: false,message:error.message,error:'Internal server error'})
            log.error(error.message);
        }
    }

    async sendOtp(req: Request, res:Response):Promise<void>{
        const email = req.body.email;  
        try {
            const data = await authService.sendOtp(email);

            res.status(200).json({success: true, data})
        } catch (error:any) {
            res.status(500).json({success: false,message:error.message,error:'Internal server error'})
            log.error(error.message);
        }
    }

    async verifyOtp(req: Request, res:Response):Promise<void>{
        const otpEntered = req.body.otpEntered;
        const email = req.query.email as string;
        try {
            const isValidOtp = await authService.verifyOtp(email, otpEntered);
            
            res.status(200).json({ success: true, isValidOtp});
        } catch (error:any) {
            res.status(500).json({success: false,message:error.message,error:'Internal server error'})
            log.error(error.message);
        }
    }

    async resetPassword(req: Request, res:Response):Promise<void>{
        const RePassword  = req.body.RePassword;
        const email = req.query.email as string
            
        try {
            const data = await authService.resetPassword(email, RePassword);

            res.status(200).json({ success: true, data});
        } catch (error:any) {
            res.status(500).json({success: false,message:error.message,error:'Internal server error'})
            log.error(error.message);
        }
    }

}

export default new authController();
