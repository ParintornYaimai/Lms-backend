import { Response, Request, NextFunction } from "express";
import { secretModel } from "../model/user.Model";
import jwt from 'jsonwebtoken'

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
 