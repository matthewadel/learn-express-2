import { Router } from "express";
import { validateRequestSchema } from "../middlewares/validateRequestSchema";
import { usersSchema } from "../schemas/users.schema";
import { UsersController } from "../controllers/users.controller";
import {
  compressSingleImage,
  uploadSingleImage
} from "../middlewares/uploadSingleImage";

const router = Router();
const usersController = new UsersController();

router
  .route("/")
  .get(
    validateRequestSchema(usersSchema.getAllUsers),
    usersController.getAllUsers
  )
  .post(
    uploadSingleImage("profileImage"),
    compressSingleImage("profileImage", "profileImages"),
    validateRequestSchema(usersSchema.createUser),
    usersController.createUser
  );

router
  .route("/:userId")
  .get(usersController.getUserById)
  .put(
    uploadSingleImage("profileImage"),
    compressSingleImage("profileImage", "profileImages"),
    validateRequestSchema(usersSchema.updateUser),
    usersController.updateUser
  )
  .delete(usersController.deleteUser);

router.put(
  "/:userId/updatePassword",
  validateRequestSchema(usersSchema.updateUserPassword),
  usersController.updateUserPassword
);

export default router;
