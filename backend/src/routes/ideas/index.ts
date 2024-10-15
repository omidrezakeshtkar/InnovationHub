import { Router } from "express";
// Core imports
import createIdeaRoute from "./core/createIdeaRoute";
import getIdeasRoute from "./core/getIdeasRoute";
import getIdeaByIdRoute from "./core/getIdeaByIdOrTitleRoute";
import updateIdeaRoute from "./core/updateIdeaRoute";
import deleteIdeaRoute from "./core/deleteIdeaRoute";
import getIdeaVersionsRoute from "./core/getIdeaVersionsRoute";
// Interactions imports
import approveIdeaRoute from "./interactions/approveIdeaRoute";
import voteIdeaRoute from "./interactions/voteIdeaRoute";
import addCommentRoute from "./interactions/addCommentRoute";
import getCommentByIdeaRoute from "./interactions/getCommentByIdeaRoute";
// Management imports
import getPendingApprovalIdeasRoute from "./management/getPendingApprovalIdeasRoute";
import getIdeaByUserRoute from "./management/getIdeaByUserRoute";

const router = Router();

// Core routes
router.use("/", getIdeasRoute);
router.use("/", getIdeaByIdRoute);
router.use("/", getIdeaVersionsRoute);
router.use("/", createIdeaRoute);
router.use("/", updateIdeaRoute);
router.use("/", deleteIdeaRoute);

// Interaction routes
router.use("/", getCommentByIdeaRoute);
router.use("/", approveIdeaRoute);
router.use("/", voteIdeaRoute);
router.use("/", addCommentRoute);

// Management routes
router.use("/", getPendingApprovalIdeasRoute);
router.use("/", getIdeaByUserRoute);

export default router;
