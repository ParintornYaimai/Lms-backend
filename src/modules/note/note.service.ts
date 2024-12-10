import { noteCreateDataType, noteDeteteType, noteGetByTagType, noteUpdateDataType, noteGetByIdType } from "src/type/note.type";
import {noteModel} from "../../model/note.Model"
import { userModel } from "../../model/user.Model";
import { Types } from "mongoose";

class noteService{

    async getAll(){
        const note = await noteModel.find();
        if(note.length === 0) throw new Error('No data found');

        return note;
    }

    async getById(id: string){
        const note = await noteModel.findById(id);
        if(!note) throw new Error(`Data not found ${id}`);

        return note;
    }

    // For account owner
    // My note 
    async getByIdForAccountId(data:noteGetByIdType){
        const note = await noteModel.find({author: {$in: data.id}}).populate('author','-email -password -role -courses -comments -refreshTokens -createdAt -updatedAt');
        if(note.length === 0) throw new Error(`Data not found ${data.id}`);

        return note;
    }

    async getByTag(data:noteGetByTagType){
        const {tag} = data

        const note = await noteModel.find({tag:tag});
        if(note.length === 0) throw new Error(`Data not found ${tag}`);

        return note;
    }   

    async create(data:noteCreateDataType){
        const {title, tag, description, id} = data 
        const newNote = await  noteModel.create({title, tag, description,author:id});

        const user = await userModel.findById(id);
        if (!user || !user.notes) throw new Error('User not found');

        user.notes.push(newNote._id);
        await user.save();

        return newNote;
    }

    async update(data:noteUpdateDataType){
        const {id,title, tag, description,accountOwnerId} = data

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

    //ต้องเช็คว่ามี id อยู่ใน usermodel ถึงจะลบได้
    //ยังบัคอยู่ยังสามารถลบได้ทั้งหมด ต้องเเก้ให้ลบได้เฉราะ id note ที้ userเก็บเเละ ลบid note ที่ user เเละเป็นข้อมูลที่ลบเเล้วด้วย
    async delete(data:noteDeteteType){
        if (!data.id) {
            throw new Error("ID is required for deletion");
        }
        const userNote = await userModel.findById(data.accountOwnerId).select('notes') 
        console.log(userNote)
        if(!userNote || !userNote.notes) throw new Error('User not found')

        const notes: object[] = userNote.notes;
        
        if (notes.includes({id:data.id})) throw new Error('Cannot be deleted');

        const deleteNote = await noteModel.findByIdAndDelete(data.id, { new:true });
        if(!deleteNote) throw new Error(`Note with id: ${data.id} not found`)
        
        return deleteNote
    }

}

export default new noteService()