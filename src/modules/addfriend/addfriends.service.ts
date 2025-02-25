import { createReq } from "../../types/addFriendsReq.type";
import {AddFriendReqModel} from "../../model/friendrequest.Model"
import { userModel } from "../../model/user.Model";
import mongoose from "mongoose";


class addFriendsService{
    
    async getAll(userId: string){
        const getAllReq = await AddFriendReqModel.find({fromuser: userId})
        .populate("fromuser","firstname lastname")
        .populate("toUserId","firstname lastname")
        .lean();
        if(!getAllReq) throw new Error("Data not found");

        return getAllReq;
    }

    async search(email: string, userId: string){
        const searchEmail = await userModel.findOne({email}).select('_id firstname lastname profilepicture')
        if(!searchEmail) throw new Error("Data not found")
        
        const newObjId = new mongoose.Types.ObjectId(userId);
        if (searchEmail._id.equals(newObjId)) throw new Error("You cannot search your own email.");

        return searchEmail;
    }
        
    async create({fromuser, toUserId }: createReq ){
        if(fromuser.toString() === toUserId.toString()) throw new Error("You cannot send a friend request to yourself.");

        const checkReq = await AddFriendReqModel.findOne({
            $or: [
                { fromuser, toUserId }, 
                { fromuser: toUserId, toUserId: fromuser } 
            ],
            status: { $in: ["pending", "accepted"] } 
        });
        if (checkReq) throw new Error("Friend request already exists or you are already friends.");
        
        const createReq = await AddFriendReqModel.create({ fromuser, toUserId, status: "pending" });
        if(!createReq) throw new Error("Unable to send request");
    
        return createReq; 
    }

    async updated(userId: string, toUserId: string){
        const deleted = await AddFriendReqModel.findOneAndUpdate({
            fromuser: userId, 
            toUserId: toUserId,

        },{status:'accepted'});
    
        if (!deleted) throw new Error("The request cannot be updated."); 
        return { success: true, message: "Friend request accepted successfully" };
    }

    async delete(userId: string, toUserId: string){
        const deleted = await AddFriendReqModel.findOneAndDelete({
            fromuser: userId, 
            toUserId: toUserId
        });
    
        if (!deleted) throw new Error("The request cannot be canceled."); 
        return { success: true, message: "Friend request canceled successfully" };
    }
}

export default new addFriendsService();