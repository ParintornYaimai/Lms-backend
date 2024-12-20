import { Types } from "mongoose";

export interface userTypeModel {
    firstname: string
    lastname: string
    email: string
    password: string
    role?: string
    courses?: Types.ObjectId[]
    notes?: Types.ObjectId[]
    comments?: Types.ObjectId[]
    profilepicture?: string
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
    // oldSecrets: [{
    //     secret: { type: String, required: true },
    //     expiresAt: { type: Date, required: true }
    // }],
}

// สำหรับการอัปเดตข้อมูลผู้ใช้
export interface UpdateUserRequestType {
    name: string;
    email: string;
    password: string;
    welcomeMessage: string;
    language: string;
    dateFormat: string;
    timeFormat: string;
    country: string;
    timeZone: string;
    currentTime: string;
  }
