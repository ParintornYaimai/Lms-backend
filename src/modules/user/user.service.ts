import { UpdateUserRequestType } from "../../types/user.type";
import { userModel } from "../../model/user.Model";
import log from '../../util/logger';

class UserService {
  // Get User by ID
  async getUser(userId: string) {
    const user = await userModel.findOne({ userId });

    if (!user) {
      log.error(`User with ID ${userId} not found`);
      throw new Error("User not found");
    }

    log.info(`User with ID ${userId} fetched successfully`);
    return user;
  }

// Update User
  async updateUser(userId: string, data: UpdateUserRequestType) {  

    const user = await userModel.findOne({ userId });

    if (!user) {
      log.error(`User with ID ${userId} not found`);
      throw new Error("User not found");
    }

    const updatedUser = { ...user.toObject(), ...data };

    const savedUser = await userModel.findByIdAndUpdate(user._id, updatedUser, { new: true });

    if (!savedUser) {
      log.error(`Failed to save updated user with ID ${userId}`);
      throw new Error("Failed to save updated user");
    }

    log.info(`User with ID ${userId} updated successfully`);
    return savedUser;
  }

  // Delete User
  async deleteUser(userId: string) {  
    // userId เป็น string
    const result = await userModel.deleteOne({ userId });

    if (result.deletedCount === 0) {
      log.error(`User with ID ${userId} not found`);
      throw new Error("User not found");
    }

    log.info(`User with ID ${userId} deleted successfully`);
  }
}

export default new UserService();
