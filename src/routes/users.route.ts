import { Router } from "express";
import { validateRequestSchema } from "../middlewares";
import { usersSchema } from "../schemas";
import { UsersController } from "../controllers";
import { uploadSingleImage } from "../middlewares/uploadSingleImage";
import { compressSingleImage } from "../middlewares/uploadSingleImage";
import { allowedTo } from "../middlewares";
import { verifyToken } from "../middlewares";
import { UserRoles } from "../models";

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
    compressSingleImage("profileImage", "profileImage", "profileImages"),
    validateRequestSchema(usersSchema.createUser),
    usersController.createUser
  );

router
  .route("/:userId")
  .get(usersController.getUserById)
  .put(
    uploadSingleImage("profileImage"),
    compressSingleImage("profileImage", "profileImage", "profileImages"),
    validateRequestSchema(usersSchema.updateUser),
    usersController.updateUser
  )
  .delete(usersController.deleteUser);

router
  .route("/:userId/change-role")
  .put(
    validateRequestSchema(usersSchema.changeUserRole),
    usersController.changeUserRole
  );

export default router;
