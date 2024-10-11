import { Router } from "express"; // Importing the Router from express
import getUserProfileRoute from "./getUserProfile"; // Importing the route for getting user profile
import updateUserProfileRoute from "./updateUserProfile"; // Importing the route for updating user profile
import deleteUserRoute from "./deleteUser"; // Importing the route for deleting user

const router = Router(); // Creating a new instance of the Router

// Use the user profile routes
router.use("/", getUserProfileRoute); // Using the getUserProfileRoute for the root path
router.use("/", updateUserProfileRoute); // Using the updateUserProfileRoute for the root path
router.use("/", deleteUserRoute); // Using the deleteUserRoute for the root path

export default router; // Exporting the router
