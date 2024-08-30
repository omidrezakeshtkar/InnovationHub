import { Router } from "express"; // Import the Router from express for routing
import userRoutes from "./user"; // Import user routes from the user index
import ideaRoutes from "./ideas"; // Import idea routes
import badgeRoutes from "./badge"; // Import badge routes from the badge index
import categoryRoutes from "./category"; // Import category routes from the category index
import analyticsRoutes from "./analytics"; // Import analytics routes from the analytics index

// Create a new Router instance
const router = Router();

// Mount the user routes at the /user path
router.use("/user", userRoutes); 
// Mount the idea routes at the /ideas path
router.use("/ideas", ideaRoutes);
// Mount the badge routes at the /badges path
router.use("/badges", badgeRoutes); 
// Mount the category routes at the /categories path
router.use("/categories", categoryRoutes); 
// Mount the analytics routes at the /analytics path
router.use("/analytics", analyticsRoutes); 

// Export the router for use in the application
export default router;
