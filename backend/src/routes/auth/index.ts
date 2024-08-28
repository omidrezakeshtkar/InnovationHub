import { Router } from "express";
import registerRoute from "./register"; // Importing the register route
import loginRoute from "./login"; // Importing the login route
import logoutRoute from "./logout"; // Importing the logout route

const router = Router();

// Use the separated routes
router.use(registerRoute);
router.use(loginRoute);
router.use(logoutRoute);

export default router;
