import { Types } from "mongoose";

export interface assignmentTypeModel extends Document{
    homeworkId: Types.ObjectId[]
    createdbyteacher: Types.ObjectId
    subject: Types.ObjectId
    course: Types.ObjectId;
    passpercen: number
    schedule: Date[]
    endDate: Date[]
    files: string[]
    score: string
    status: string
    action: string[]
}

export interface CreateAssignment {
    homeworkId?: Types.ObjectId[]
    createdbyteacher: Types.ObjectId
    subject: string
    course: Types.ObjectId;
    passpercen: number
    schedule: Date[]
    endDate: Date[]
    files?: string[]
    score?: string
    status?: string
    action: string[]
}

export interface assignmentResponse {
    homeworkId?: Types.ObjectId[]
    createdbyteacher: Types.ObjectId
    subject: Types.ObjectId
    course: Types.ObjectId;
    passpercen: number
    schedule: Date[]
    endDate: Date[]
    files: string[]
    score: string
    status: string
    action: string[]
}