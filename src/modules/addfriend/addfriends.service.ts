import { createReq } from "../../types/addFriendsReq.type";
import {AddFriendReqModel} from "../../model/friendrequest.Model"
import { studentModel } from "../../model/student.Model";
import mongoose from "mongoose";


class addFriendsService{
    
    async getAll(userId: string) {
        const getAllReq = await AddFriendReqModel.find({
            toUserId: userId,
            status: { $in: ['accepted', 'pending'] }
        })
        .populate("fromUserId", "firstname lastname profilepicture")
        .sort({ 
            status: 1 // เรียงตาม status แบบ ascending → 'accepted' > 'pending'
        })
        .lean();

        if (!getAllReq || getAllReq.length === 0) throw new Error("Data not found");

        // เรียงใหม่แบบ custom ให้ pending ขึ้นก่อน (กรณีต้องควบคุมมากกว่า)
        const sorted = getAllReq.sort((a, b) => {
            if (a.status === 'pending' && b.status === 'accepted') return -1;
            if (a.status === 'accepted' && b.status === 'pending') return 1;
            return 0;
        });

        return sorted;
    }


    async search(email: string, userId: string){
        const searchEmail = await studentModel.findOne({email}).select('_id firstname lastname profilepicture')
        if(!searchEmail) throw new Error("Data not found")
        
        const newObjId = new mongoose.Types.ObjectId(userId);
        if (searchEmail._id.equals(newObjId)) throw new Error("You cannot search your own email.");

        return searchEmail;
    }
        
    async create({fromUserId, toUserId }: createReq ){
        if(fromUserId.toString() === toUserId.toString()) throw new Error("You cannot send a friend request to yourself.");

        const checkReq = await AddFriendReqModel.findOne({
            $or: [
                { fromUserId, toUserId }, 
                { fromUserId: toUserId, toUserId: fromUserId } 
            ],
            status: { $in: ["pending", "accepted"] } 
        });
        if (checkReq) throw new Error("Friend request already exists or you are already friends.");
        
        const createReq = await AddFriendReqModel.create({ fromUserId, toUserId, status: "pending" });
        if(!createReq) throw new Error("Unable to send request");
    
        return createReq; 
    }

    async updated(toUserId: string){
        const friendRequest = await AddFriendReqModel.findById(toUserId);
        if (!friendRequest) throw new Error("The friend request does not exist.");

        const update = await AddFriendReqModel.updateOne(
            { _id: friendRequest._id }, 
            { $set: { status: 'accepted' } } 
        );
        
        if(update.modifiedCount === 0)throw new Error("The friend request cannot be updated.");
    
        return { success: true, message: "Friend request accepted successfully" };
    }

    async delete(userId: string, toUserId: string){
        const deleted = await AddFriendReqModel.findOneAndDelete({
            fromUserId: userId, 
            toUserId: toUserId
        });
    
        if (!deleted) throw new Error("The request cannot be canceled."); 
        return { success: true, message: "Friend request canceled successfully" };
    }
}

export default new addFriendsService();