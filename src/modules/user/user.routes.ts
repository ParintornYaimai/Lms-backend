import express from "express";
import userController from "../user/user.controller";
import validate from "../../middleware/validateData";
import { updateUserSchema } from "../../schema/user.schema";

const router = express.Router();



router.get("/", userController.getUser);
router.patch("/update",validate(updateUserSchema),userController.updateUser);
router.delete("/delete", userController.deleteUser);

export default router;
