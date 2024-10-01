import { Router } from "express"; // Importing the Router from express
import getUserProfileRoute from "./getUserProfile"; // Importing the route for getting user profile
import updateUserProfileRoute from "./updateUserProfile"; // Importing the route for updating user profile

const router = Router(); // Creating a new instance of the Router

// Assign routes to the main category router
router.use("/", getUserProfileRoute); // Using the getUserProfileRoute for the root path
router.use("/", updateUserProfileRoute); // Using the updateUserProfileRoute for the root path

export default router; // Exporting the router
