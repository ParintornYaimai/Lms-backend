import { MessageModel } from '../../model/messages.Model';
import {ChatModel, ChatgroupModel} from '../../model/chat.Model'
import { AddFriendReqModel } from '../../model/friendrequest.Model';
import mongoose, { Types } from 'mongoose';
import { studentModel } from '../../model/student.Model';

class chatService{

    async getAllFriends(userId: string) {
        const friends = await AddFriendReqModel.find({
            $or: [
                { fromUserId: userId, status: 'accepted' },
                { toUserId: userId, status: 'accepted' }
            ]
        })
        .populate('fromUserId', 'firstname lastname profilepicture')
        .populate('toUserId', 'firstname lastname profilepicture')
        .lean()

        if(friends.length === 0) return [];

        const friendProfiles = [];
        for(let i = 0; i < friends.length; i++){
            const friendship = friends[i];
            const isFromUser = friendship.fromUserId._id.toString() === userId;
            friendProfiles.push(isFromUser ? friendship.toUserId : friendship.fromUserId);
        }

        return friendProfiles;
    }

    
    async getAll(userId: string) {

        const [chatData, chatGroups] = await Promise.all([
            ChatModel.find({ $or: [{ sender: userId }, { receiver: userId }] })
            .populate("sender receiver", "firstname lastname email profilepicture")
            .lean(),
            ChatgroupModel.find({ "people.user": userId })
            .populate("people.user", "firstname lastname email profilepicture")
            .lean()
        ]);

        const allChats = [...chatData, ...chatGroups];
        if (allChats.length === 0) throw new Error('Data not found');

        const chatroomIds = allChats.map(chat => chat._id);

        const latestMessages = await MessageModel.aggregate([
            {
                $match: {
                    chatroom: { $in: chatroomIds }
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $group: {
                    _id: "$chatroom",
                    latestMessage: { $first: "$$ROOT" }
                }
            },
            {
                $lookup: {
                    from: studentModel.collection.name, 
                    localField: "latestMessage.sender",
                    foreignField: "_id",
                    as: "latestMessage.sender",
                    pipeline: [
                        {
                            $project: {
                                firstname: 1,
                                lastname: 1,
                                email: 1,
                                profilepicture: 1
                            }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: studentModel.collection.name,
                    localField: "latestMessage.receiver",
                    foreignField: "_id",
                    as: "latestMessage.receiver",
                    pipeline: [
                        {
                            $project: {
                                firstname: 1,
                                lastname: 1,
                                email: 1,
                                profilepicture: 1
                            }
                        }
                    ]
                }
            },
            {
                $addFields: {
                    "latestMessage.sender": { $arrayElemAt: ["$latestMessage.sender", 0] },
                    "latestMessage.receiver": { $arrayElemAt: ["$latestMessage.receiver", 0] }
                }
            },
            {
                $project: {
                    _id: 0,
                    chatroomId: "$_id",
                    latestMessage: {
                        $mergeObjects: [
                            "$latestMessage",
                            {
                                _id: "$$REMOVE",
                                chatroom: "$$REMOVE",
                                createdAt: "$$REMOVE",
                                updatedAt: "$$REMOVE"
                            }
                        ]
                    }
                }
            }
        ]);

        const messageMap = new Map(latestMessages.map(item => [item.chatroomId.toString(), item.latestMessage]));

        // ประมวลผลข้อมูล chat
        const chatsWithLatestMessage = allChats.map(chat => {
            const latestMessage = messageMap.get(chat._id.toString());
            
            if('sender' in chat && 'receiver' in chat){
                // แชทแบบ 1-1
                const otherUser = chat.sender._id.toString() === userId ? chat.receiver : chat.sender;

                return{
                    ...chat,
                    latestMessage,
                    otherUser,
                };
            }else if('people' in chat){
                return{
                    ...chat,
                    latestMessage,
                    people: chat.people.map(p => p.user),
                };
            }
            return null;
        }).filter(Boolean);

        // เรียงลำดับตาม timestamp
        const sortedChats = chatsWithLatestMessage.sort((a, b) => {
            const aTime = a?.latestMessage?.createdAt?.getTime() || 0;
            const bTime = b?.latestMessage?.createdAt?.getTime() || 0;
            return bTime - aTime;
        });

        return sortedChats;
    }
 

    async create(sender: string, receiver: string){
        const checkChat = await ChatModel.findOne({
            $or: [
                { sender, receiver },
                { sender: receiver, receiver: sender }
            ]
        }).lean();
        if(checkChat) return checkChat
            
        const createChat = await ChatModel.create({sender, receiver})
        return createChat
    }

    async creategroup(peopleId:string[]){
        const uniquePeopleId = [...new Set(peopleId)];
        if(uniquePeopleId.length < 2) throw new Error("A chat group must have at least 2 participants.");

        const newGroup = new ChatgroupModel({
            people: uniquePeopleId.map((peopleId) => ({ user: peopleId }))
        });

        const savedGroup = await newGroup.save();
        return savedGroup;
    }

    async addMember(groupChatId: string, peopleId: string[]) {
        const uniqueIds = [...new Set(peopleId)];
        const newPeopleObjectIds = uniqueIds.map(id => new Types.ObjectId(id));
        
        const result = await ChatgroupModel.findByIdAndUpdate(
            groupChatId,
            {
                $addToSet: {
                    people: {
                        $each: newPeopleObjectIds.map(id => ({ user: id }))
                    }
                }
            },
            { new: true, lean: true }
        );
        
        if(!result) throw new Error(`Group chat with ID ${groupChatId} not found`);

        return result;
    }


    async delete(chatId: string, userId: string) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try{
            // ลอง find ใน ChatModel ก่อน
            const chat = await ChatModel.findById(chatId).session(session);
            
            if(chat){
                
                // ตรวจสอบว่า user เป็น sender หรือ receiver
                if(chat.sender.toString() === userId || chat.receiver.toString() === userId){
                    await ChatModel.findByIdAndUpdate(
                        chatId, 
                        { $set: { isDeleted: true } },
                        { session }
                    );
                }else{
                    throw new Error("You are not authorized to delete this chat");
                }
            }else{

                const result = await ChatgroupModel.findByIdAndUpdate(
                    chatId,
                    { $pull: { people: { user: new Types.ObjectId(userId) } } },
                    { session, new: true }
                );
                if(!result)throw new Error("Chat not found");

                // ตรวจสอบว่า user เคยเป็นสมาชิกหรือไม่
                const wasUpdated = result.people.some(p => p.user.toString() !== userId);
                if(!wasUpdated) throw new Error("You are not a member of this group");
            }

            await session.commitTransaction();
            return { success: true, message: "You have left the chat." };
        }catch(error){
            await session.abortTransaction();
            throw error;
        }finally{
            session.endSession();
        }
    }   
    
}


export default new chatService();