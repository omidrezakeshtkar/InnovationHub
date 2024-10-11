import { Router } from "express";
import loginRoute from "./login";
import logoutRoute from "./logout";
import refreshTokenRoute from "./refreshToken";
import registerRoute from "./register";

const router = Router();

// Use the auth routes
router.use("/login", loginRoute);
router.use("/logout", logoutRoute);
router.use("/refresh-token", refreshTokenRoute);
router.use("/register", registerRoute);

export default router;