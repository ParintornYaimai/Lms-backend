// import multer from "multer";
// import cloudinary from "config/cloudinary";



// const uploadPic =async()=>{
//     const storage = multer.memoryStorage();  // ใช้ memoryStorage เพื่อเก็บไฟล์ใน memory ก่อน
//     const upload = multer({ storage: storage });

//     const result = await cloudinary.uploader.upload_stream(
//         { folder: 'uploads', public_id: `image_${Date.now()}` }, // ตั้ง folder และ public_id
//         (error, result) => {
//           if (error) {
//             throw new Error("Error uploading image.")
//           }
  
//           // ส่งผลลัพธ์จาก Cloudinary (เช่น URL ของไฟล์)
//           return {url: result.secure_url,}
         
//         }
//       );
// }