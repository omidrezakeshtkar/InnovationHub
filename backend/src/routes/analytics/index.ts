import { Router } from "express";
import analyticsRoute from "./analyticsRoute";
import categoryAnalyticsRoute from "./categoryAnalyticsRoute";
import ideaTrendsRoute from "./ideaTrendsRoute";
import overallAnalyticsRoute from "./overallAnalyticsRoute";
import userEngagementRoute from "./userEngagementRoute";

const router = Router();

// Use the analytics routes
router.use("/", analyticsRoute);
router.use("/", categoryAnalyticsRoute);
router.use("/", ideaTrendsRoute);
router.use("/", overallAnalyticsRoute);
router.use("/", userEngagementRoute);

export default router;
