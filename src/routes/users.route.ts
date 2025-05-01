import { Router } from "express";
import { validateRequestSchema } from "../middlewares/validateRequestSchema";
import { usersSchema } from "../schemas/users.schema";
import { UsersController } from "../controllers/users.controller";
import {
  compressSingleImage,
  uploadSingleImage
} from "../middlewares/uploadSingleImage";
import { allowedTo } from "../middlewares/allowedTo";
import { verifyToken } from "../middlewares/verifyToken";
import { UserRoles } from "../models/entities/user.entity";

const router = Router();
const usersController = new UsersController();

router.use(verifyToken, allowedTo([UserRoles.ADMIN]));

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

export default router;
