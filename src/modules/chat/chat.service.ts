import { MessageModel } from '../../model/messages.Model';
import {ChatModel, ChatgroupModel} from '../../model/chat.Model'
import { AddFriendReqModel } from '../../model/friendrequest.Model';
import mongoose, { Types } from 'mongoose';

class chatService{

    async getAllFriends(userId: string){
        console.log("UserID ",userId);
        
        const friends = await AddFriendReqModel.find({
            $or: [
                { fromUser: userId},
                { toUser: userId},
                {status: 'accepted'}
            ]
        });
        if(friends.length === 0) throw new Error('No friends');
        
        return friends
    }
    
    async getAll(userId:string){
        const [chatData, chatGroups] = await Promise.all([
            ChatModel.find({ $or: [{ sender: userId }, { receiver: userId }] }).populate("sender receiver", "username email profilepicture"), 
            ChatgroupModel.find({ "people.user": userId }).populate("people.user", "username email profilepicture") 
        ]);
        
        const allChats = [...chatData,...chatGroups.flat()];
        if(allChats.length === 0) throw new Error('Data not found')

        const chatsWithLatestMessage = await Promise.all(
            allChats.map(async (chat) => {
                if('sender' in chat && 'receiver' in chat) {
                    const latestMessage = await MessageModel.findOne({ chatroom: chat._id })
                    .sort({ createdAt: -1 })
                    .select('-_id -chatroom -createdAt -updatedAt ')
                    .populate('receiver','username email profilepicture')
                    .populate('sender','username email profilepicture')
                    .lean();

                    return { ...chat.toObject(), latestMessage };
                    
                }else if ('people' in chat) {
                    const latestMessage = await MessageModel.findOne({ chatroom: chat._id })
                    .sort({ createdAt: -1 })
                    .select('-_id -chatroom -createdAt -updatedAt')
                    .populate('chatroom')
                    .populate('receiver','username email profilepicture')
                    .populate('sender','username email profilepicture')
                    .lean();
        
                    return { ...chat.toObject(), latestMessage, people: chat.people.map(p => p.user) };
                }
                return null;
            })
        );

        const sortedChats = chatsWithLatestMessage.sort((a, b) => {
            if(a && b){
                const aTime = a.latestMessage?.createdAt?.getTime() || 0;
                const bTime = b.latestMessage?.createdAt?.getTime() || 0;
                return bTime - aTime;
            }
            return 0; 
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
        const checkChat = await ChatgroupModel.findById(groupChatId);
    
        const newPeopleId = peopleId.map((id) => ({ user: new Types.ObjectId(id) }));
    
        if (checkChat) {
            const existingMembers = checkChat.people.map((member) => member.user.toString());
            const membersToAdd = newPeopleId.filter(
                (newMember) => !existingMembers.includes(newMember.user.toString())
            );
            
            if (membersToAdd.length > 0) {
                checkChat.people.push(...membersToAdd);
                const result = await checkChat.save();
                return result;
            } else {
                return checkChat; 
            }
        } else {
            const createGroupChat = await ChatgroupModel.create({
                members: newPeopleId
            });
            return createGroupChat;
        }
    }


    async delete(chatId: string) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const checkChat = await ChatModel.findById(chatId).session(session);
            
            let chatData;
            if(checkChat){
                chatData = await ChatModel.findByIdAndDelete(chatId).session(session);
            }else {
                chatData = await ChatgroupModel.findByIdAndDelete(chatId).session(session);
            }
            await MessageModel.deleteMany({ chatId }).session(session);


            await session.commitTransaction();
            session.endSession();

            return chatData;
        } catch (error) {

            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    }

}


export default new chatService();