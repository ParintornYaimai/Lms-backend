import { Request, Response, NextFunction } from 'express';
import { checkForVirus } from '../util/helper';

const virusScanMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const files = req.files as Express.Multer.File[];
    if (!files) {
        return res.status(400).json({ message: 'No files uploaded' });
    }

    try {
        for(const file of files){
            const isSafe = await checkForVirus(file.buffer, file.originalname);
            if (!isSafe) {
                return res.status(400).json({ message: 'File contains malicious content' });
            }
        }
        next(); 
    }catch(error: any){
        res.status(400).json({ message: error.message });
    }
};
export default virusScanMiddleware;
