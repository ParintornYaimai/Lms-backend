import { createNoteType, updateNoteType, getNoteByIdType } from "src/types/note.type";
import {NoteModel} from "../../model/note.Model"
import { studentModel } from "../../model/student.Model";
import { Types } from "mongoose";
import { client } from "../../../config/connectToRedis";

class noteService{

    async getAll(){
        const note = await NoteModel.find()
        .populate('author','firstname lastname profilepicture')
        .select('-comments'); ;
        if(note.length === 0) throw new Error('No data found');

        const keyAllNotes = 'note:all'; 
        if(client) await client.setEx(keyAllNotes, 3600, JSON.stringify(note)); 

        return note;
    }

    async getById(id: string){
        const note = await NoteModel.findById(id)
        .populate('author','firstname lastname profilepicture')
        .populate({
            path: 'comments',
            populate: {
                path: 'author',
                select: 'firstname lastname profilepicture', 
            },
        });
        if(!note) throw new Error('Note not found')

        const keyNote = `note:${note._id}`; 
        if(client)await client.setEx(keyNote, 3600, JSON.stringify(note)); 

        return note;
    }

    // For account owner
    // My note 
    async getByIdForAccountId(id: getNoteByIdType){
        const note = await NoteModel.find({author: {$in: id}})
        .populate('comments')
        .populate('author','firstname lastname profilepicture');
        if(note.length === 0) throw new Error(`Data not found ${id}`);

        return note;
    }

    async getByTag(tag: string){
        //ป้องกัน
        const safeTag = tag.replace(/[\$|\.]/g, "");
        const note = await NoteModel.find({tag:safeTag})
        .populate('author','firstname lastname profilepicture');
        if(note.length === 0) throw new Error(`Data not found ${tag}`);

        return note;
    }   

    async create({title, tag, description, id}: createNoteType){
        const newNote = await  NoteModel.create({title, tag, description,author:id});

        const updatedUser = await studentModel.findByIdAndUpdate(id,{ $push: { notes: newNote._id } },{ new: true } );
        if (!updatedUser) throw new Error('User not found');

        const keyNote = `note:${newNote._id}`; 
        const keyAllNotes = `note:all`; 

        if(client){
            const cachedDataAll = await client.get(keyAllNotes);
            let allNotes = cachedDataAll ? JSON.parse(cachedDataAll) : [];
    
            allNotes.push(newNote);
    
            await client.setEx(keyNote, 3600, JSON.stringify(newNote));
            await client.setEx(keyAllNotes, 3600, JSON.stringify(allNotes));
        }

        return newNote;
    }

    async update({id,title, tag, description,userId}: updateNoteType){
        const userNote = await studentModel.findById(userId).select('notes') 
        if(!userNote || !userNote.notes) throw new Error('User not found')

        const notes: Types.ObjectId[] = userNote.notes as Types.ObjectId[];

        if (!notes.map(note => note.toString()).includes(id)) {
            throw new Error('Unable to update');
        }

        const updateNote = await NoteModel.findByIdAndUpdate(id,{title, tag, description},{
            new: true
        })
        if (!updateNote) throw new Error(`Note with id: ${id} not found`);

        const keyNote = `note:${id}`;
        const keyAllNotes = `note:all`;
        if(client){
            await client.del(keyNote);  
            await client.del(keyAllNotes);  
        }
    
        return updateNote;
    }

    async delete(id:string, accountOwnerId:string){
        const userNote = await NoteModel.findOne({
            _id: id,
            author: accountOwnerId,
        }); 

        if(!userNote) throw new Error("Cannot be deleted");
    
        const deleteNote = await NoteModel.findByIdAndDelete(id);

        await studentModel.findByIdAndUpdate(accountOwnerId, {
            $pull: { notes: id },
        });

        const keyNote = `note:${id}`;
        const keyAllNotes = `note:all`;
        if(client){
            await client.del(keyNote);  
            await client.del(keyAllNotes);  
        }
    
        return deleteNote;
    }

}

export default new noteService()