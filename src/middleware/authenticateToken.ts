import { Response, Request, NextFunction } from "express";
import { secretModel } from "../model/student.Model";
import jwt from 'jsonwebtoken';

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    let token: string;
    
    const authHeader = req.headers['authorization'];
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
        // Use Access Token
        token = authHeader.split(' ')[1];
        if(!req.cookies.refresh_token){
            return res.status(401).json({
                error: 'Authentication required',
                message: 'Refresh token is empty or invalid'
            });
        }
    } else if (req.cookies?.refresh_token) {
        // Fallback to Refresh Token
        token = req.cookies.refresh_token;
        if (!token) {
            return res.status(401).json({
                error: 'Authentication required',
                message: 'Refresh token is empty or invalid'
            });
        }
    } else {
        return res.status(401).json({
            error: 'Authentication required',
            message: 'Provide Bearer token or refresh token'
        });
    }
    
    // ตรวจสอบว่า token ไม่เป็น empty string
    if (!token || token.trim() === '') {
        return res.status(401).json({
            error: 'Authentication required',
            message: 'Token is empty or invalid'
        });
    }
    
    try {
        const secret = await secretModel.findOne();
        if (!secret || !secret.currentSecret) {
            return res.status(500).json({ 
                error: 'Internal server error',
                message: 'Secret key configuration error'
            });
        }
        
        // Verify JWT token
        const decoded = jwt.verify(token, secret.currentSecret as string);
        
        // ตรวจสอบว่า decoded ไม่ใช่ null หรือ undefined
        if (!decoded) {
            return res.status(401).json({
                error: 'Invalid token',
                message: 'Token verification failed'
            });
        }
        
        // เพิ่ม user ข้อมูลลงใน request object
        (req as any).user = decoded;
        
        return next();
        
    } catch (error) {
        
        // ตรวจสอบประเภทของ error
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                error: 'Invalid token',
                message: 'Token is malformed or invalid'
            });
        } else if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                error: 'Token expired',
                message: 'Please refresh your token'
            });
        } else if (error instanceof jwt.NotBeforeError) {
            return res.status(401).json({
                error: 'Token not active',
                message: 'Token is not active yet'
            });
        } else {
            return res.status(500).json({
                error: 'Internal server error',
                message: 'Authentication process failed'
            });
        }
    }
};