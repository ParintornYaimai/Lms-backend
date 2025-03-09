import { UpdateUserRequestType } from "../../types/user.type";
import { studentModel } from "../../model/student.Model";
import mongoose from "mongoose";
import { CommentModel } from "../../model/comment.Model";
import { NoteModel } from "../../model/note.Model";
import { AssignmentModel } from "../../model/assignment.Model";
import { client } from "../../../config/connectToRedis";

class UserService {
  async getUser(userId: string) {
    const userData = await studentModel.findById(userId).select('-password -refreshTokens');
    if(!userData) throw new Error("User not found");

    const keyNote = `user:${userData._id}`; 
    if(client)await client.setEx(keyNote, 3600, JSON.stringify(userData));

    return userData;
  }

  // Update User
  async updateUser({ userId, firstname, lastname, welcomeMessage, language, dateFormat, timeFormat, country, timeZone, currentTime }: UpdateUserRequestType) {
    const user = await studentModel.findById({ userId });
    if(!user) throw new Error("User not found");

    const savedUser = await studentModel.findByIdAndUpdate(userId,
      { firstname, lastname, welcomeMessage, language, dateFormat, timeFormat, country, timeZone, currentTime },
      { new: true });

    if(!savedUser) throw new Error("Failed to save updated user");

    const keyNote = `user:${user._id}`;
    if(client) await client.del(keyNote);  

    return savedUser;
  }

  async deleteUser(userId: string) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const deleteUser = await studentModel.findByIdAndDelete(userId, { session });

      if(!deleteUser) throw new Error("User not found");

      await CommentModel.deleteMany({ userId }, { session });
      await NoteModel.deleteMany({ userId }, { session });
      await AssignmentModel.deleteMany({ userId }, { session });

      await session.commitTransaction();
      
      const keyNote = `user:${userId}`;
      if(client) await client.del(keyNote);  
      
      return deleteUser;
    } catch (error) {

      await session.abortTransaction();
      throw error;
    } finally {

      session.endSession();
    }
  }
}

export default new UserService();
