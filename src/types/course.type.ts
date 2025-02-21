import { Document, Types } from "mongoose";

type BaseContent = {
    type: "description" | "file" | "video";
};

type TextContent = BaseContent & {
    type: "description";
    content: string;
};

type PDFContent = BaseContent & {
    type: "file";
    size: number;
    url: string;
};

type VideoContent = BaseContent & {
    type: "video";
    url: string;
};

type Content = TextContent | PDFContent | VideoContent;

export interface CourseModelType extends Document {
    title: string;
    subtitle: string;
    coursecate: Types.ObjectId;
    coursesubjectcate: Types.ObjectId;
    coursetopic: string;
    duration: Date;
    thumbnailurl: string;
    coursematerial: string;
    mainpoint: string[];
    coursereq: string[];
    coursecrm: [{
        section: {
            sectionname: string;
            content: Content[];
        };
    }];
    welmsg: string;
    conmsg: string;
    feedback: Types.ObjectId[]; 
    createby: Types.ObjectId; 
    assignment: Types.ObjectId[]; 
}

export interface CreateCourse{
    title: string;
    subtitle: string;
    coursecate: Types.ObjectId;
    coursesubjectcate: Types.ObjectId;
    coursetopic: string;
    duration: number;
    thumbnailurl: string;   
    coursematerial: string;
    mainpoint: string[]; 
    coursereq: string[]; 
    coursecrm: [{
        section: {
            sectionname: string;
            content: Content[];
        };
    }];
    welmsg?: string; 
    conmsg?: string;
    createby: Types.ObjectId; 
}

export interface CourseCRM {
    crmName: string;
    crmUrl: string;
}

export interface UpdateCourse{
    title: string;
    subtitle: string;
    coursecate: string;
    coursesubjectcate: string;
    coursetopic: string;
    duration: number;
    thumbnailurl: string; 
    coursematerial: string;
    mainpoint: string[]; 
    coursereq: string[]; 
    coursecrm: CourseCRM[]; 
    welmsg?: string; 
    conmsg?: string;
}