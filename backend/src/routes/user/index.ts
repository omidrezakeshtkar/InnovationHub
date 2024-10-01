import { Router } from "express"; // Import the Router from express
import authRoutes from "./auth";
import profileRoutes from "./profile";

const router = Router(); // Create a new instance of the Router

// Use auth routes for authentication-related endpoints
router.use("/auth", authRoutes);

// Use profile routes for user profile-related endpoints
router.use("/profile", profileRoutes);

export default router; // Export the router
