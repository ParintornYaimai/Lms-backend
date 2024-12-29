import mammoth from 'mammoth';
import pdfParse from 'pdf-parse';
import JSZip from 'jszip';
import vision, { ImageAnnotatorClient } from '@google-cloud/vision';
import sharp from 'sharp';
import log from './logger';
import axios from 'axios';
import FormData from 'form-data';
import { Readable } from 'stream';
import FileType from 'file-type';

export const checkDocxContent = async (fileBuffer: Buffer): Promise<boolean> => {
    try {
        const { value: textContent } = await mammoth.extractRawText({ buffer: fileBuffer });
        const dangerousKeywords = [
            '<script>', 'eval(', 'alert(', 'document.write', 'window.location', 'setTimeout(', 
            'setInterval(', '<object>', '<embed>', '<iframe>', 'window', 'document.cookie', 'Function('
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
            '<script>', 'eval(', 'alert(', 'document.write', 'window.location', 'setTimeout(', 
            'setInterval(', '<object>', '<embed>', '<iframe>', 'window', 'document.cookie', 'Function('
        ];

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
            '<script>', 'eval(', 'alert(', 'document.write', 'window.location', 'setTimeout(', 
            'setInterval(', '<object>', '<embed>', '<iframe>', 'window', 'document.cookie', 'Function('
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

        const client = new vision.ImageAnnotatorClient();
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
        console.log('checkImage error');
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
    console.log('checkForVirus Active');
    
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

        if(positives > 0){
            throw new Error('File contains malicious content');
        }
        
        return true;
    }catch(error: any){
        throw new Error(`Error scanning file for viruses: ${error.message}`);
    }
}

