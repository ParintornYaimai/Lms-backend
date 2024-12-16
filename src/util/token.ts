import jwt from 'jsonwebtoken'
import authService from '../modules/auth/auth.service'
import { Request, Response,NextFunction } from 'express';
import { secretModel } from '../model/user.Model';




// create Access_token
export const generateAccessToken =async(user:any)=>{
    const secret = await authService.getCurrentSecret();
    return jwt.sign({ id: user.id, firstname: user.firstname, lastname: user.lastname , email: user.email ,role: user.role  }, secret, { expiresIn: '5m' });
}

// create Refresh_token
export const generateRefreshToken =async(user:any)=>{
    const secret = await authService.getCurrentSecret();

    const existToken = user.refreshTokens.find(
        (refreshToken: any)=> new Date(refreshToken.expiresAt) > new Date()
    );

    if(existToken){
        return existToken.token
    }

    const token = jwt.sign({ id: user.id, firstname: user.firstname, lastname: user.lastname , email: user.email ,role: user.role  }, secret, { expiresIn: '7d' });
    
    // save Refresh Token 
    user.refreshTokens.push({ token, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
    await user.save();
  
    return token;
}

export const authenticateToken  =async(req: Request, res: Response, next:NextFunction)=>{
    let token: string ;
    if(req.headers['authorization']){
        const authHeader = req.headers['authorization']
        if(!authHeader || !authHeader.startsWith('Bearer ')){
            return res.status(401).json({ error: 'Access token required' })
        }else if(!req.cookies.refresh_token){
            return res.status(401).json({ error: 'Refresh token required' });
        }

        token = authHeader.split(' ')[1];
    }else{
        token = req.cookies.refresh_token; 
        if (!token) {
          return res.status(401).json({ error: 'Refresh token required' });
        }
    }

    try {
        const secret = await secretModel.findOne();
        if (!secret || !secret.currentSecret) {
            console.error('Secret key not found or invalid.');
            return res.status(500).json({ error: 'Secret key not found' });
        }

        const decode = jwt.verify(token,secret?.currentSecret as string)

        if(decode){
            (req as any).user = decode; 
            // req.user = decode 
            return next()
        }
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
 