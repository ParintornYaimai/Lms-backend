import { Readable } from 'stream';
import { gfs } from '../../../config/connectToDB';
import mongoose from 'mongoose';


class uploadService {
    

    async upload(buffer: Buffer, filename: string){


        return new Promise((resolve, reject)=>{
            const chunkSize = 1 * 1024 * 1024; // chunk size
            const chunks = []; // chunk array

            for(let i = 0; i < buffer.length; i += chunkSize){
                chunks.push(buffer.slice(i, i + chunkSize));
            }

            const uploadStream = gfs.openUploadStream(filename);

            uploadStream.setMaxListeners(40)
            let uploadedChunksCount = 0;

            const uploadChunk = (chunk: Buffer) => {
                const bufferStream = new Readable();
                bufferStream.push(chunk);
                bufferStream.push(null); 

                bufferStream.pipe(uploadStream, { end: false});

                bufferStream.on('end', () => {
                    uploadedChunksCount++;

                    if(uploadedChunksCount === chunks.length){
                        uploadStream.end(); 
                        const fileUrl = `/file/${uploadStream.id}`;
                        resolve({ fileId: uploadStream.id, filename, fileUrl });
                    }
                });

                bufferStream.on('error', (err) => {
                    reject(new Error(err.message));
                });
            };

            chunks.forEach(uploadChunk);
        });
    }

    async getById(id: string){
        if(!gfs) throw new Error('GridFSBucket is not initialized');

        const fileInfo  = await gfs.find({ _id: new mongoose.Types.ObjectId(id) }).toArray();
        if(!fileInfo  || fileInfo .length === 0) throw new Error('File not found')
            
        const file = fileInfo[0];

        return {
            stream: gfs.openDownloadStream(file._id),
            filename: file.filename,
            contentType: file.contentType || 'application/octet-stream'
        };
    }
}

export default new uploadService();

