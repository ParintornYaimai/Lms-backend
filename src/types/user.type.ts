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
    assignments?: Types.ObjectId[]
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
}