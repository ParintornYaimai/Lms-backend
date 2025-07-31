import { Types } from "mongoose";


export interface noteTypeModel extends Document{
    title: string
    tag:string
    description: string
    author: Types.ObjectId
    comments: Types.ObjectId[];
}

export interface createNoteType{
    id:Types.ObjectId
    title: string,
    tag?:string,
    description: string
}

export interface updateNoteType{
    id: string
    title?: string,
    tag?:string,
    description?: string
    userId: string
}
