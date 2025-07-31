import { Types } from "mongoose";

export interface userTypeModel {
    firstname: string
    lastname: string
    welcomeMessage?:string
    language?:string
    dateFormat?:string
    timeFormat?:string
    country?:string
    timeZone?:string
    currentTime?:string
    email: string
    password: string
    role?: string
    assignments?: Types.ObjectId[]
    profilepicture?: {
        fileId: string
        filename: string,
        fileUrl: string,
    }
    refreshTokens?: { token: string; expiresAt: Date }[];
}

export interface loginTypeModel{
    email: string
    password: string
}

export interface logoutTypeModel{
    id: string
    refresh_token: string
}

export interface secretTypeModel{
    currentSecret: string ,
    oldSecrets: { secret: string; expiresAt: Date }[]; 
}

// สำหรับการอัปเดตข้อมูลผู้ใช้
export interface UpdateUserRequestType {
    userId?: string;
    firstName?: string;
    lastName?: string;
    message?: string;
    language?: string;
    dateFormat?: string;
    timeFormat?: string;
    country?: string;
    timeZone?: string;
    currentTime?: string;
    profilePicture?: string;
}
