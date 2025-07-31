import { Request, Response } from "express";
import log from "../../util/logger";
import uploadService from "./file.service";
import { getCorrectMimeType } from "../../util/helper";

class uploadController{

    async create(req: Request, res: Response){
        try {
            
            const files = req.files as Express.Multer.File[]; 
            if(!files || files.length === 0) {
                return res.status(400).json({ message: "No files uploaded" });
            }

            const uploadPromises = files.map(file => {
                if(file.buffer && file.originalname){
                    return uploadService.upload(file.buffer, file.originalname);
                }
                throw new Error("Invalid file data");
            });

            const data = await Promise.all(uploadPromises);
            res.status(200).json({success: true,data})
        } catch (error: any) {
            res.status(500).json({success: false,message:error.message,error:'Internal server error'});
            log.error(error.message);
        }
    }
    
    async getById(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const { stream, filename, contentType } = await uploadService.getById(id);
            
            // ถ้า contentType ไม่ถูกต้อง ให้ detect จาก filename
            const correctContentType = contentType === 'application/octet-stream' ? getCorrectMimeType(filename) : contentType;
                
            res.setHeader('Content-Type', correctContentType as string);
            res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
            
            stream.pipe(res);
            
            stream.on('error', (err) => {
                if(!res.headersSent){
                    res.status(500).json({
                        success: false,
                        message: 'Error while downloading file',
                        error: 'Internal server error'
                    });
                }
            });
            
        }catch(error: any){
            if(!res.headersSent){
                res.status(500).json({
                    success: false,
                    message: error.message,
                    error: 'Internal server error'
                });
            }
            log.error(error.message);
        }
    }
}

export default new uploadController();

