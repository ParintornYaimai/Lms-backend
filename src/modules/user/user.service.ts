import { UpdateUserRequestType } from "../../types/user.type";
import { userModel } from "../../model/user.Model";
import log from '../../util/logger';

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

    log.info(`User with ID ${userId} updated successfully`);
    return savedUser;
  }

  async deleteUser(userId: string) {  
    
    const deleteUser = await userModel.findByIdAndDelete(userId);

    if (!deleteUser) {
      throw new Error("User not found");
    };

    return deleteUser;
  }
}

export default new UserService();
