import { Router } from "express"; // Importing the Router from express
import getUserRoute from "./getUserProfile"; // Importing the route for getting user profile
import updateUserRoute from "./updateUserProfile"; // Importing the route for updating user profile

const router = Router(); // Creating a new instance of the Router

// Assign routes to the main category router
router.use("/", getUserRoute); // Using the getUserRoute for the root path
router.use("/", updateUserRoute); // Using the updateUserRoute for the root path

export default router; // Exporting the router
