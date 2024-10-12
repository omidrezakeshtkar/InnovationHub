import { Router } from "express";
import loginRoute from "./loginRoute";
import logoutRoute from "./logoutRoute";
import refreshTokenRoute from "./refreshTokenRoute";
import registerRoute from "./registerRoute";

const router = Router();

// Use the auth routes
router.use("/login", loginRoute);
router.use("/logout", logoutRoute);
router.use("/refresh-token", refreshTokenRoute);
router.use("/register", registerRoute);

export default router;