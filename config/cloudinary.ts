import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import multerStorageCloudinary from 'multer-storage-cloudinary';

cloudinary.config({ 
    cloud_name:  `${process.env.CLOUDINARY_CLOUD_NAME}` , 
    api_key: `${process.env.CLOUDINARY_API_KEY}`, 
    api_secret: `${process.env.CLOUDINARY_API_SECRET}`
});

const storage = multerStorageCloudinary({
    cloudinary: cloudinary,
    params: async (req, file) => {
      
      const folderName = 'picture/userprofile'; 
      const fileFormat = 'jpeg,png'; 
      const uniqueId = `${Date.now()}-${file.originalname}`
      
      return {
        folder: folderName,
        format: fileFormat,
        public_id: uniqueId,
      };
    }
  });

  
  const upload = multer({ storage });
  
export { upload,cloudinary };
