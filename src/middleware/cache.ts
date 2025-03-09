import { Request, Response, NextFunction } from 'express';
import {client} from '../../config/connectToRedis';

const cacheMiddleware = (keyPrefix: string) => async (req: Request, res: Response, next: NextFunction) => {
    const key = `${keyPrefix}:${req.params.id || 'all'}`; 

    if(!client || !client.isOpen) return res.status(500).send('Unable to connect to Redis');

    const cachedData = await client.get(key);
    if(cachedData) return res.status(200).json({ success: true, data: JSON.parse(cachedData) });
    
    next();
};

export default cacheMiddleware;