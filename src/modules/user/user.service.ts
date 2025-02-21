import { UpdateUserRequestType } from "../../types/user.type";
import { userModel } from "../../model/user.Model";
import mongoose from "mongoose";
import { CommentModel } from "../../model/comment.Model";
import { NoteModel } from "../../model/note.Model";
import { AssignmentModel } from "../../model/assignment.Model";


class UserService {
  async getUser(userId: string) {
    const userData = await userModel.findById(userId).select('-password -refreshTokens');
    
    if (!userData) {
      throw new Error("User not found");
    }

    return userData;
  }

// Update User
  async updateUser({userId, firstname, lastname, welcomeMessage, language, dateFormat, timeFormat, country, timeZone, currentTime}: UpdateUserRequestType) {  
    const user = await userModel.findById({ userId });

    if (!user) {
      throw new Error("User not found");
    }
    const savedUser = await userModel.findByIdAndUpdate(userId,
    {firstname,lastname ,welcomeMessage, language, dateFormat, timeFormat, country, timeZone, currentTime},
    { new: true });

    if (!savedUser) {
      throw new Error("Failed to save updated user");
    }

    return savedUser;
  }

  async deleteUser(userId: string) {
    const session = await mongoose.startSession();
    session.startTransaction();

  
    try {
      const deleteUser = await userModel.findByIdAndDelete(userId, { session });
  
      if (!deleteUser) {
        throw new Error("User not found");
      }
  
      await CommentModel.deleteMany({ userId }, { session });
      // await HomeworkModel.deleteMany({ userId }, { session });
      await NoteModel.deleteMany({ userId }, { session });
      await AssignmentModel.deleteMany({ userId }, { session });
  
      await session.commitTransaction();
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
