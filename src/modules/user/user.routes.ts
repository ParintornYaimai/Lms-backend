import express from "express";
import userController from "../user/user.controller";
import validate from "../../middleware/validateData";
import { updateUserSchema } from "../../schema/user.schema";
import { checkRole } from "../../middleware/checkRole";
import cacheMiddleware from '../../middleware/cache'


const router = express.Router();



router.get("/",checkRole(['student']),cacheMiddleware('user'),userController.getUser);
router.patch("/update",checkRole(['student']),validate(updateUserSchema),userController.updateUser);
router.delete("/delete",checkRole(['student']),userController.deleteUser);

export default router;
