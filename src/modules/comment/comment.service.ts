import { userModel } from "../../model/user.Model";
import { CommentModel } from "../../model/comment.Model";
import {createCommentType, DeleteCommentType} from "../../types/comment.type";
import { noteModel } from "../../model/note.Model";
import mongoose from "mongoose";

class commmentService{
    async create({content, noteId, author}: createCommentType):Promise<createCommentType>{
        const newComment = await CommentModel.create({content, noteId, author});

        const updatedNote = await noteModel.findByIdAndUpdate(noteId,{$push: {comments:newComment._id}},{new: true});
        if (!updatedNote) throw new Error('Note not found');

        const updatedUser = await userModel.findByIdAndUpdate(author,{$push: {comments:newComment._id}},{new: true});
        if(!updatedUser) throw new Error('User not found');

        return newComment
    }


    async delete({id, accountOwnerId}: DeleteCommentType){
        if(!id){
            throw new Error('Id is required')
        }

        const session = await mongoose.startSession();

        try {
            session.startTransaction();

            const deleteComment = await CommentModel.findOne({
                _id: id,
                author: accountOwnerId,
            }).session(session); 

            if (!deleteComment) {
                throw new Error("Cannot be deleted");
            }

            await CommentModel.findByIdAndDelete(id).session(session);

            await noteModel.findByIdAndUpdate(deleteComment.noteId, {
                $pull: { comments: id },
            }).session(session);   

            await userModel.findByIdAndUpdate(accountOwnerId, {
                $pull: { comments: id },
            }).session(session); 

            await session.commitTransaction();
            session.endSession();

            return deleteComment;
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    }
}

export default new commmentService()