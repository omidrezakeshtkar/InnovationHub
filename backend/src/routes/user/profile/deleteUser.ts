import { Router } from "express";
import { deleteUser } from "../../../handlers/userHandlers";
import { auth } from "../../../middleware/auth";
import { authorize } from "../../../middleware/authorize";
import { PERMISSIONS } from "../../../config/permissions";
import { registry } from "../../../config/swagger";
import { GlobalErrorSchema } from "../../../schemas";
import { UserDeleteSchema } from "../../../schemas/User.schema";
import { validateRequest } from "../../../middleware/validateRequest";

const router = Router();

registry.registerPath({
  method: "delete",
  path: "/user/profile/{id}",
  summary: "Delete a user by their ID",
  tags: ["User Profile"],
  security: [{ bearerAuth: [] }],
  request: {
    params: UserDeleteSchema.shape.params,
  },
  responses: {
    200: {
      description: "User deleted successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
        },
      },
    },
    404: {
      description: "User not found",
      content: {
        "application/json": {
          schema: GlobalErrorSchema,
        },
      },
    },
  },
});

router.delete("/:id", auth, authorize(PERMISSIONS.DELETE_USER), validateRequest(UserDeleteSchema), deleteUser);

export default router;