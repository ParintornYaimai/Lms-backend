import { createMessage, deleteMessage, editMessage } from "../../types/message.type";
import { MessageModel } from "../../model/messages.Model";

class messageService{

    async getAll(chatId: string, userId: string){
        const messages = await MessageModel.find({
            $or: [
                { sender: userId, chatroom: chatId },
                { receiver: userId, chatroom: chatId }
            ]
        }).sort({ createdAt: 1 });

        if(messages.length === 0) throw new Error('No message delivery information') 

        return messages;
    }

    async create({chatroom, sender, receiver,messageText, files}: createMessage){
        const createMessage = await MessageModel.create({
            chatroom, sender, receiver ,messageText, files
        })

        return createMessage
    }

    async edit({chatroom, messageId,sender, messageText, actions, status}: editMessage){
        const updatedMessage = await MessageModel.findOneAndUpdate({ _id: messageId  ,chatroom, sender},{ messageText, actions, status},{new: true});
        if(!updatedMessage) throw new Error("Can't updated");

        return updatedMessage;
    }

    async delete({chatId, messageId, sender }: deleteMessage){
        const deleted = await MessageModel.deleteOne({_id:messageId, chatroom:chatId, sender})
        if(deleted.deletedCount === 0) throw new Error("Can't delete message");

        return deleted;
    }
}   

export default new messageService();  