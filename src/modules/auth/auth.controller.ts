import { Request, Response } from 'express';
import authService from './auth.service';
import { Register,Login, Logout } from 'src/schema/auth.sechema';
// import { upload } from 'config/cloudinary';
import log from '../../util/logger';


class authController{

    async register(req: Request<{},{},Register>, res: Response):Promise<void>{
        try {
            const {firstname, lastname, email, password,} = req.body;
            const createUserData = await authService.create({firstname, lastname, email, password});

            res.status(201).json({success: true,message: 'register successfully'});
        } catch (error:any) {
            res.status(500).json({success: false,message:error.message,error:'Internal server error'})
            log.error({error:error.message})
        }
    }

    async login(req: Request<{}, {}, Login>, res: Response):Promise<void>{ 
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
            log.error({error:error.message})
        }
    }
    
    async logout(req: Request<{}, {}, Logout>, res: Response):Promise<void>{
        
        try {
            const {id} = req.body
            const refresh_token = req.cookies.refresh_token
            await authService.loggout({id,refresh_token});

            res.clearCookie('refresh_token', {
                httpOnly: true, 
                secure: false, 
                sameSite: 'strict', 
            });
            res.status(200).json({success: true, message: 'Logged out successfully' });
            
        } catch (error: any) {
            res.status(500).json({success: false,message:error.message,error:'Internal server error'})
            log.error({error:error.message})
        }
    }

    async refreshtoken(req: Request, res: Response):Promise<void>{
        try {
            const { refreshTokenInput } = req.cookies; 
            if (!refreshTokenInput){
                res.status(401).send('Refresh Token required');
            }

            const newAccessToken  = authService.refreshToken(refreshTokenInput)
            res.status(200).json({ access_Token: newAccessToken })
        } catch (error:any) {
            res.status(500).json({success: false,message:error.message,error:'Internal server error'})
            log.error({error:error.message})
        }
    }
}

export default new authController();