import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
    const allowedTypes: { [key: string]: number } = {
        "application/pdf": 20 * 1024 * 1024,  
        "application/msword": 20 * 1024 * 1024,  
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": 20 * 1024 * 1024, 
        "application/vnd.ms-powerpoint": 20 * 1024 * 1024, 
        "application/vnd.openxmlformats-officedocument.presentationml.presentation": 20 * 1024 * 1024,  
        "image/jpeg": 4 * 1024 * 1024,  
        "image/png": 4 * 1024 * 1024, 
        "video/mp4": 2 * 1024 * 1024 * 1024,  
    };

    const fileMimeType = file.mimetype;
    const maxSize = allowedTypes[fileMimeType];

    if (!maxSize) {
        return cb(new Error("Unsupported file type"), false);
    }

    if (file.size > maxSize) {
        return cb(new Error(`File size exceeds the ${maxSize / 1024 / 1024 / 1024}GB limit for ${fileMimeType}`), false);
    }

    cb(null, true);  
};

  
const upload = multer({
    storage,
    fileFilter,
}).array('files',5);

export default upload;
