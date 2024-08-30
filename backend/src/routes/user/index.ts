import { Router } from "express"; // Import the Router from express
import authenticate from "./auth"; // Import the authentication routes
import profile from "./profile"; // Import the profile routes

const router = Router(); // Create a new instance of the Router

// Assign routes to the main user router
router.use("/auth", authenticate); // Use the refresh token route
router.use("/profile", profile); // Use the profile routes

export default router; // Export the router
