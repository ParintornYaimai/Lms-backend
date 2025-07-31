import { createNoteType, updateNoteType } from "src/types/note.type";
import {NoteModel} from "../../model/note.Model"
import { studentModel } from "../../model/student.Model";
import { client } from "../../../config/connectToRedis";

class noteService{

    async getAll(){
        const note = await NoteModel.find()
        .populate('author','firstname lastname profilepicture')
        .select('-comments').sort({ createdAt: -1 });
        if(note.length === 0) throw new Error('No data found');

        // const keyAllNotes = 'note:all'; 
        // if(client) await client.setEx(keyAllNotes, 3600, JSON.stringify(note)); 

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

        return note;
    }

    // My note 
    async getByIdForAccountId(id: string){
        
        const note = await NoteModel.find({author: {$in: id}})
        .select('-comments')
        .populate('author','firstname lastname profilepicture');
        if(note.length === 0) throw new Error(`Data not found ${id}`);

        return note;
    }

    async getByTag(tag: string, sortBy: string, userId?: string) {
        const safeTag = tag.replace(/[\$|\.]/g, "");
        let filter: any = {};

        const now = new Date();

        if(sortBy === 'This week') {
            const day = now.getDay();
            const diffToMonday = (day === 0 ? -6 : 1 - day);
            const monday = new Date(now);
            monday.setDate(now.getDate() + diffToMonday);
            monday.setHours(0, 0, 0, 0);

            const sunday = new Date(monday);
            sunday.setDate(monday.getDate() + 6);
            sunday.setHours(23, 59, 59, 999);

            filter.createdAt = { $gte: monday, $lte: sunday };
        }

        if(sortBy === 'This month') {
            const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
            const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

            filter.createdAt = { $gte: firstDay, $lte: lastDay };
        }

        if(sortBy === 'This year') {
            const firstDay = new Date(now.getFullYear(), 0, 1);
            const lastDay = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);

            filter.createdAt = { $gte: firstDay, $lte: lastDay }; 
        }
        
        if(userId){
            filter.author = userId
        }

        const query = safeTag ? { tag: safeTag, ...filter } : { ...filter };
        const note = await NoteModel.find(query)
            .select('-comments')
            .populate('author', 'firstname lastname profilepicture')
            .sort({createdAt:-1});

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
    
            await client.setEx(keyAllNotes, 3600, JSON.stringify(allNotes));
        }

        return newNote;
    }

    async update({id,title, tag, description,userId}: updateNoteType){
        const checkOwnerNote = await NoteModel.findById(id)
        if (!checkOwnerNote) throw new Error("Note not found");
    
        if (checkOwnerNote.author.toString() !== userId) throw new Error("Permission denied: Can't update");
        
        // const userNote = await studentModel.findById(userId).select('notes') 
        // if(!userNote || !userNote.notes) throw new Error('User not found')

        // const notes: Types.ObjectId[] = userNote.notes as Types.ObjectId[];

        // if(!notes.map(note => note.toString()).includes(id)) {
        //     throw new Error('Unable to update');
        // }

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