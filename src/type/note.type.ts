import { Types } from "mongoose";
import { string } from "zod";

export interface noteTypeModel{
    title: string
    tag:string
    description: string
    author: Types.ObjectId
    comments: Types.ObjectId[];
}

export interface noteGetByIdType{
    id:Types.ObjectId ,   
}

export interface noteGetByTagType{
    tag:string ,   
}

export interface noteCreateDataType{
    id:Types.ObjectId
    title: string,
    tag?:string,
    description: string
}

export interface noteUpdateDataType{
    id: string
    title?: string,
    tag?:string,
    description?: string
    accountOwnerId: string
}

export interface noteDeteteType{
    id: string
    accountOwnerId:string
}