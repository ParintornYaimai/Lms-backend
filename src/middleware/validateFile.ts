import { Request, Response, NextFunction } from 'express'
import { checkDocxContent, checkPDFContent, checkPptxContent, checkImage, checkVideo} from '../util/helper';


const validateFile = (req: Request, res: Response, next: NextFunction) => {
    const files = req.files as Express.Multer.File[];
    let isSafe  = true

    if(!files){
        return res.status(400).json({ message: 'No files uploaded' });
    }

    Promise.all(
        files.map(async (file) => {
            const fileExtension = file.originalname.split('.').pop()?.toLowerCase();

            switch (fileExtension) {
                case 'pdf':
                    isSafe = await checkPDFContent(file.buffer);
                    break;
                case 'doc':
                case 'docx':
                    isSafe = await checkDocxContent(file.buffer);
                    break;
                case 'ppt':
                case 'pptx':
                    isSafe = await checkPptxContent(file.buffer);  
                    break;
                case 'jpeg':
                case 'jpg':
                case 'png':
                    isSafe = await checkImage(file.buffer); 
                    break;
                case 'mp4':
                    isSafe = await checkVideo(file.buffer); 
                    break;
                default:
                    throw new Error('Unsupported file type');
            }

            if(!isSafe) throw new Error(`${fileExtension.toUpperCase()} file contains potential threats`);
        })
    )
    .then(() => {
        next();
    })
    .catch((error) => {
        res.status(400).json({ message: error.message});
    });
};

export default validateFile