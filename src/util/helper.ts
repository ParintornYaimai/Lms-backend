import mammoth from 'mammoth';
import pdfParse from 'pdf-parse';
import JSZip from 'jszip';
import vision from '@google-cloud/vision';
import sharp from 'sharp';
import log from './logger';
import axios from 'axios';
import FormData from 'form-data';
import { Readable } from 'stream';
import FileType from 'file-type';
import transporter from '../../config/nodemailer'
import mongoose from 'mongoose';

export const checkDocxContent = async (fileBuffer: Buffer): Promise<boolean> => {
    try {
        const { value: textContent } = await mammoth.extractRawText({ buffer: fileBuffer });
        const dangerousKeywords = [
            'eval(', 'alert(', 'document.write', 'window.location', 
            '<object>', '<embed>', '<iframe>', 'window', 'document.cookie', 
        ];

        let isSafe = true;
        dangerousKeywords.forEach((keyword) => {
            if(textContent.includes(keyword)){
                throw new Error(`Dangerous keyword found in DOCX: ${keyword}`)
            }
        });

        return isSafe;
    } catch (error: any) {
        log.error(error.message);
        throw new Error('Error processing DOCX file');
    }
};

export const checkPDFContent = async(fileBuffer: Buffer): Promise<boolean>=>{
    try {
        const data = await pdfParse(fileBuffer);
        const textContent = data.text;

        const dangerousKeywords = [
            'eval(', 'alert(', 'document.write', 'window.location', 
            '<object>', '<embed>', '<iframe>', 'window', 'document.cookie', 
        ];;

        let isSafe = true;
        dangerousKeywords.forEach((keyword) => {
            if(textContent.includes(keyword)){
                throw new Error(`Dangerous keyword found in PDF: ${keyword}`)
            }
        });

        return isSafe;
    } catch (error: any) {
        log.error(error.message);
        throw new Error('Error processing PDF file');
    }
}

export const checkPptxContent = async(fileBuffer: Buffer): Promise<boolean>=>{
    try {
        const zip = await JSZip.loadAsync(fileBuffer);
        const slides = [] as any;
    
        Object.keys(zip.files).forEach((filename) => {
            if(filename.includes('ppt/slides/slide')){
                zip.files[filename].async('text').then((content) => {
                    slides.push(content);
                });
            }
        });

        const allSlidesContent = await Promise.all(slides);
        let textContent = allSlidesContent.join(' ');

        const dangerousKeywords = [
            'eval(', 'alert(', 'document.write', 'window.location', 
            '<object>', '<embed>', '<iframe>', 'window', 'document.cookie', 
        ];

        let isSafe = true;
        dangerousKeywords.forEach((keyword) => {
            if(textContent.includes(keyword)){
                throw new Error(`Dangerous keyword found in PPTX: ${keyword}`)
            }
        });

        return isSafe;
    } catch (error: any) {
        log.error(error.message);
        throw new Error('Error processing PPTX file');
    }
}

export const checkImage =async(fileBuffer: Buffer): Promise<boolean>=>{
    try {
        const client = new vision.ImageAnnotatorClient({
            keyFilename: 'C:/Users/guy18/OneDrive/Desktop/googlekey/heroic-vial-446113-u6-49fdbbd1989e.json'
        });
        let isSafe = true;

        const image = sharp(fileBuffer);
        const metadata = await image.metadata();
        
        if(!metadata.width || !metadata.height){
            throw new Error('File is not a valid image.');
        }
    
        const exifData = metadata.exif;
        if(exifData){
            throw new Error('Metadata found');
        }

        const [result] = await client.safeSearchDetection(fileBuffer);
        const safeSearch = result.safeSearchAnnotation;
        
        if(!safeSearch || safeSearch.adult === 'VERY_LIKELY' || safeSearch.adult === 'LIKELY'){
            throw new Error('Metadata found');
        }
            
        return isSafe;
    } catch (error: any) {
        log.error(error.message);
        throw new Error('Error processing image file');
    }
}

export const checkVideo = async (fileBuffer: Buffer): Promise<boolean> => {

    const allowedMimeTypes = ['video/mp4', 'video/avi', 'video/mkv', 'video/webm'];
    let isSafe = true;

    const fileType = await FileType.fromBuffer(fileBuffer);

    if (!fileType || !allowedMimeTypes.includes(fileType.mime)) {
        throw new Error('The file is not a supported video format');
    }
        
    return isSafe; 
};


const bufferToStream =(buffer: Buffer):Readable=> {
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null); 
    return stream;
}

export const checkForVirus =async(fileBuffer: Buffer,fileName: string)=>{
    const apiKey = process.env.API_KEY;
    const url = 'https://www.virustotal.com/api/v3/files';
    
    try{

        const formData = new FormData();
        formData.append('file', bufferToStream(fileBuffer), fileName);
        
        const response = await axios.post(url, formData, {
            headers: {
                'x-apikey': apiKey,
                ...formData.getHeaders()
            }
        });

        const analysisId = response.data.data.id;
        const analysisUrl = `https://www.virustotal.com/api/v3/analyses/${analysisId}`;
        
        let analysisResponse;
        do{
            analysisResponse = await axios.get(analysisUrl, {
                headers: {
                    'x-apikey': apiKey
                }
            });
            await new Promise(resolve => setTimeout(resolve, 5000));
        }while(analysisResponse.data.data.attributes.status !== 'completed');
        
        const stats = analysisResponse.data.data.attributes.stats;
        const positives = stats.malicious + stats.suspicious;

        if(positives > 0) throw new Error('File contains malicious content');
        
        return true;
    }catch(error: any){
        throw new Error(`Error scanning file for viruses: ${error.message}`);
    }
}


export const sendOtpEmail = async(userEmail:string, otp:string) => {
    const mailOptions = {
        from: process.env.EMAIL,
        to: userEmail,
        subject: 'Password Reset OTP',
        text: `Your OTP for resetting your password is: ${otp}`
    };
    try {
        await transporter.sendMail(mailOptions);

        return 'OTP sent successfully';
    } catch (error) {
        return `Error sending OTP: ${error}`;
    }
};

const imageTypes = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg', 
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'svg': 'image/svg+xml'
};

// Videos  
const videoTypes = {
    'mp4': 'video/mp4',
    'avi': 'video/x-msvideo',
    'mov': 'video/quicktime',
    'wmv': 'video/x-ms-wmv',
    'webm': 'video/webm',
    'mkv': 'video/x-matroska'
};

// Documents
const documentTypes = {
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'xls': 'application/vnd.ms-excel',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'ppt': 'application/vnd.ms-powerpoint',
    'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'txt': 'text/plain'
};

// Audio
const audioTypes = {
    'mp3': 'audio/mpeg',
    'wav': 'audio/wav',
    'ogg': 'audio/ogg',
    'aac': 'audio/aac'
};

// Function to get correct MIME type
export function getCorrectMimeType(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase();
    
    // ตรวจสอบว่า ext มีค่าก่อนใช้เป็น index
    if(!ext) return 'application/octet-stream';
    
    return imageTypes[ext as keyof typeof imageTypes] || 
           videoTypes[ext as keyof typeof videoTypes] || 
           documentTypes[ext as keyof typeof documentTypes] || 
           audioTypes[ext as keyof typeof audioTypes] || 
           'application/octet-stream'; // fallback
}
