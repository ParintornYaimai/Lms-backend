import { createNoteType, deteteNoteType, getNoteByTagType, updateNoteType, getNoteByIdType } from "src/types/note.type";
import {noteModel} from "../../model/note.Model"
import { userModel } from "../../model/user.Model";
import { Types } from "mongoose";

class noteService{

    async getAll(){
        const note = await noteModel.find()
        .populate('author','-email -password -role -courses -comments -refreshTokens -createdAt -updatedAt -notes')
        .select('-comments'); ;
        if(note.length === 0) throw new Error('No data found');

        return note;
    }

    async getById(id: string){
        if(!id){
            throw new Error('"ID is required"')
        };

        const note = await noteModel.findById(id)
        .populate('author', '-email -password -role -courses -comments -refreshTokens -createdAt -updatedAt -notes') 
        .populate({
            path: 'comments',
            populate: {
                path: 'author',
                select: '-email -password -role -refreshTokens -notes -comments -courses -createdAt -updatedAt ', 
            },
        });
    
        return note;
    }

    // For account owner
    // My note 
    async getByIdForAccountId({id}: getNoteByIdType){
        const note = await noteModel.find({author: {$in: id}})
        .populate('comments')
        .populate('author','-email -password -role -courses -comments -refreshTokens -createdAt -updatedAt -notes');
        if(note.length === 0) throw new Error(`Data not found ${id}`);

        return note;
    }

    async getByTag({tag}: getNoteByTagType){
        //ป้องกัน
        const safeTag = tag.replace(/[\$|\.]/g, "");
        const note = await noteModel.find({tag:safeTag})
        .populate('author','-email -password -role -courses -comments -refreshTokens -createdAt -updatedAt -notes');
        if(note.length === 0) throw new Error(`Data not found ${tag}`);

        return note;
    }   

    async create({title, tag, description, id}: createNoteType){
        const newNote = await  noteModel.create({title, tag, description,author:id});

        const updatedUser = await userModel.findByIdAndUpdate(id,{ $push: { notes: newNote._id } },{ new: true } );
        if (!updatedUser) throw new Error('User not found');
        
        return newNote;
    }

    async update({id,title, tag, description,accountOwnerId}: updateNoteType){
        const userNote = await userModel.findById(accountOwnerId).select('notes') 
        if(!userNote || !userNote.notes) throw new Error('User not found')

        const notes: Types.ObjectId[] = userNote.notes as Types.ObjectId[];

        if (!notes.map(note => note.toString()).includes(id)) {
            throw new Error('Unable to update');
        }

        const updateNote = await noteModel.findByIdAndUpdate(id,{title, tag, description},{
            new: true
        })
        if (!updateNote) throw new Error(`Note with id: ${id} not found`);
      
        return updateNote;
    }

    async delete({id, accountOwnerId}:deteteNoteType){
        if (!id) {
            throw new Error("ID is required for deletion");
        }
                
        const userNote = await noteModel.findOne({
            _id: id,
            author: accountOwnerId,
        }); 

        if (!userNote) {
            throw new Error("Cannot be deleted");
        }
        
        const deleteNote = await noteModel.findByIdAndDelete(id);

        await userModel.findByIdAndUpdate(accountOwnerId, {
            $pull: { notes: id },
        });
    
        return deleteNote;
    }

}

export default new noteService()