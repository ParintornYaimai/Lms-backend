import { userModel } from "../../model/user.Model";
import { CommentModel } from "../../model/comment.Model";
import {createCommentType, DeleteCommentType} from "../../types/comment.type";
import { noteModel } from "../../model/note.Model";

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

        const deleteComment =  await CommentModel.findOne({
            _id: id,
            author: accountOwnerId,
        }); 
    
        if (!deleteComment) {
            throw new Error("Cannot be deleted");
        }
        
        const deleteCommentInNote = await noteModel.findByIdAndDelete(id);

        await noteModel.findByIdAndUpdate(deleteComment.noteId, {
            $pull: { comments: id },
        });
        await userModel.findByIdAndUpdate(accountOwnerId, {
            $pull: { comments: id },
        });
    
        return deleteCommentInNote;
    }
}

export default new commmentService()