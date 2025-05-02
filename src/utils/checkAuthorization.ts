import { User } from "../models";
import { NotAuthorizedError } from "./errors";

export function checkAuthorization(
  user: User,
  entity: { user: { id: number } }
) {
  if (user.role !== "admin" && entity.user.id !== user.id)
    throw new NotAuthorizedError(
      "You are not authorized to perform this action"
    );
}
