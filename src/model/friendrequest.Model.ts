import mongoose, { Schema } from "mongoose";
import {addFriendsReq} from "../types/addFriendsReq.type"

const addFriendSchema = new Schema<addFriendsReq>({
    fromuser: { type: Schema.Types.ObjectId, ref: "Student" ,required: true },
    toUserId: {type: Schema.Types.ObjectId, ref: "Student", required: true},
    status: { type: String, enum:["pending", "accepted"], default: "pending" }
}, { timestamps: true });

export const AddFriendReqModel = mongoose.model<addFriendsReq>("AddFriendReq", addFriendSchema);