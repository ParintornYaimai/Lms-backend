import express from "express";
import userController from "../user/user.controller";
import validate from "../../middleware/validateData";
import { updateUserSchema } from "../../schema/user.schema";
import { checkRole } from "../../middleware/checkRole";

const router = express.Router();



router.get("/",checkRole(['student']),userController.getUser);
router.patch("/update",checkRole(['student']),validate(updateUserSchema),userController.updateUser);
router.delete("/delete",checkRole(['student']),userController.deleteUser);

export default router;
