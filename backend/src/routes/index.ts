import { Router } from "express"; // Import the Router from express for routing
import analyticsRoutes from "./analytics"; // Import analytics routes from the analytics index
// import badgeRoutes from "./badge"; // Import badge routes from the badge index
import categoryRoutes from "./category"; // Import category routes from the category index
import departmentRoutes from "./departments"; // Import department routes from the department index
import ideaRoutes from "./ideas"; // Import idea routes
import userRoutes from "./user"; // Import user routes from the user index

// Create a new Router instance
const router = Router();

// Mount the analytics routes at the /analytics path
router.use("/analytics", analyticsRoutes);
// Mount the badge routes at the /badges path
// router.use("/badges", badgeRoutes);
// Mount the category routes at the /categories path
router.use("/categories", categoryRoutes);
// Mount the department routes at the /departments path
router.use("/departments", departmentRoutes);
// Mount the idea routes at the /ideas path
router.use("/ideas", ideaRoutes);
// Mount the user routes at the /user path
router.use("/user", userRoutes);

// Export the router for use in the application
export default router;
