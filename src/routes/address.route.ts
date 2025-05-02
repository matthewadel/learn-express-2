import { Router } from "express";
import { AddressController } from "../controllers/address.controller";
import { allowedTo, validateRequestSchema, verifyToken } from "../middlewares";
import { addressSchema } from "../schemas/address.schema";
import { UserRoles } from "../models";

const router = Router();
const addressController = new AddressController();

router
  .route("/")
  .post(
    verifyToken,
    validateRequestSchema(addressSchema.createAddress),
    addressController.createAddress
  )
  .get(
    verifyToken,
    allowedTo([UserRoles.ADMIN]),
    addressController.getAllAddresses
  );

router
  .route("/my-addresses")
  .get(verifyToken, addressController.getMyAddresses);

router
  .route("/:addressId")
  .get(addressController.getAddressById)
  .put(
    verifyToken,
    validateRequestSchema(addressSchema.updateAddress),
    addressController.updateAddress
  )
  .delete(verifyToken, addressController.deleteAddress);

export default router;
