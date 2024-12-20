import mongoose, { Schema } from "mongoose";
import {userTypeModel,secretTypeModel} from "../types/user.type"


const userSchemaModel = new Schema<userTypeModel>({
    firstname:{type: String, required:true},
    lastname:{type: String, required:true},
    email:{type: String, required:true},
    password:{type: String, required:true},
    role:{type: String,default:'student'},
    courses:[{ type: Schema.Types.ObjectId, ref: 'Course' }], 
    notes: [{ type: Schema.Types.ObjectId, ref: 'Note' }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    assignments: [{ type: Schema.Types.ObjectId, ref: "Assignment" }],
    profilepicture: {type: String, default:null},
    refreshTokens: [{ token: String, expiresAt: Date }]
},{timestamps:true})

const secretSchema = new Schema<secretTypeModel>({
    currentSecret: { type: String, required: true },
    oldSecrets: [{
        secret: { type: String, required: true },
        expiresAt: { type: Date, required: true }
    }]
},{timestamps:true});


export const userModel = mongoose.model<userTypeModel>('User', userSchemaModel);
export const secretModel  = mongoose.model<secretTypeModel>('Secret', secretSchema);

