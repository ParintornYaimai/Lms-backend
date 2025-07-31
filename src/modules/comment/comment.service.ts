import { studentModel } from "../../model/student.Model";
import { CommentModel } from "../../model/comment.Model";
import {createCommentType, DeleteCommentType} from "../../types/comment.type";
import { NoteModel } from "../../model/note.Model";
import mongoose from "mongoose";

class commmentService{
    async create({content, noteId, author}: createCommentType):Promise<createCommentType>{
        const newCommentDoc = await CommentModel.create({ content, noteId, author });
        await Promise.all([
            NoteModel.findByIdAndUpdate(noteId, { $push: { comments: newCommentDoc._id } }),
            studentModel.findByIdAndUpdate(author, { $push: { comments: newCommentDoc._id } })
        ]);

        const newComment = await newCommentDoc.populate('author');
        return newComment;
    }


    async delete({id, accountOwnerId}: DeleteCommentType){

        const session = await mongoose.startSession();

        try{
            session.startTransaction();

            const deleteComment = await CommentModel.findOne({
                _id: id,
                author: accountOwnerId,
            }).session(session); 

            if(!deleteComment) throw new Error("Cannot be deleted");

            await CommentModel.findByIdAndDelete(id).session(session);

            await NoteModel.findByIdAndUpdate(deleteComment.noteId, {
                $pull: { comments: id },
            }).session(session);   

            await session.commitTransaction();
            session.endSession();

            return deleteComment;
        }catch(error){
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    }
}

export default new commmentService()