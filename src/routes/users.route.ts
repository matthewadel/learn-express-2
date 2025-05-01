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

router
  .route("/")
  .get(
    verifyToken,
    allowedTo([UserRoles.ADMIN]),
    validateRequestSchema(usersSchema.getAllUsers),
    usersController.getAllUsers
  )
  .post(
    verifyToken,
    allowedTo([UserRoles.ADMIN]),
    uploadSingleImage("profileImage"),
    compressSingleImage("profileImage", "profileImages"),
    validateRequestSchema(usersSchema.createUser),
    usersController.createUser
  );

router
  .route("/:userId")
  .get(verifyToken, allowedTo([UserRoles.ADMIN]), usersController.getUserById)
  .put(
    verifyToken,
    allowedTo([UserRoles.ADMIN]),
    uploadSingleImage("profileImage"),
    compressSingleImage("profileImage", "profileImages"),
    validateRequestSchema(usersSchema.updateUser),
    usersController.updateUser
  )
  .delete(
    verifyToken,
    allowedTo([UserRoles.ADMIN]),
    usersController.deleteUser
  );

export default router;
