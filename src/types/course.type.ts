import { Document, Types } from "mongoose";

type BaseContent = {
    type: "description" | "file" | "video";
};

type TextContent = BaseContent & {
    type: "description";
    name: string;
    content: string;
};

type FileContent = BaseContent & {
    type: "file";
    name: string;
    size: number;
    url: string;
};

type VideoContent = BaseContent & {
    type: "video";
    name: string;
    size: number;
    url: string;
};

type Content = TextContent | FileContent | VideoContent;

export interface CourseModelType extends Document {
    title: string;
    subtitle: string;
    coursecate: Types.ObjectId;
    coursesubjectcate: Types.ObjectId;
    coursetopic: string;
    courselanguage: string;
    subtitlelanguage: string;
    courselevel: string;
    duration: number;
    thumbnailurl: string;
    coursematerial: string;
    whatyouwillteachincourse: string[];
    coursereq: string[];
    whothiscourseisfor : string[];
    coursecrm: [{
        section: {
            sectionname: string;
            content: Content[];
        };
    }];
    welmsg: string;
    conmsg: string;
    createby: Types.ObjectId; 
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