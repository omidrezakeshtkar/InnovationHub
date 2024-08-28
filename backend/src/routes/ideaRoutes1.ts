import { Router } from "express";
import {
	getIdeas,
	getIdeaById,
	createIdea,
	updateIdea,
	deleteIdea,
	approveIdea,
	voteIdea,
	addComment,
	getIdeaVersions,
} from "../handlers/ideaHandlers";
import { auth } from "../middleware/auth";
import { authorize } from "../middleware/authorize";
import { PERMISSIONS } from "../config/permissions";
import { validateRequest } from "../middleware/validateRequest";
import { ideaSchemas } from "../validation/schemas";

const router = Router();

/**
 * @swagger
 * /ideas:
 *   get:
 *     summary: Retrieve all ideas
 *     tags: [Ideas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of ideas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Idea'
 */
router.get("/", auth, authorize(PERMISSIONS.VIEW_ALL_IDEAS), getIdeas);

/**
 * @swagger
 * /ideas/{id}:
 *   get:
 *     summary: Get an idea by ID
 *     tags: [Ideas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: An idea
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Idea'
 */
router.get("/:id", auth, getIdeaById);

/**
 * @swagger
 * /ideas:
 *   post:
 *     summary: Create a new idea
 *     tags: [Ideas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewIdea'
 *     responses:
 *       201:
 *         description: Created idea
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Idea'
 */
router.post(
	"/",
	auth,
	authorize(PERMISSIONS.CREATE_IDEA),
	validateRequest(ideaSchemas.create),
	createIdea
);

/**
 * @swagger
 * /ideas/{id}:
 *   put:
 *     summary: Update an idea
 *     tags: [Ideas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateIdea'
 *     responses:
 *       200:
 *         description: Updated idea
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Idea'
 */
router.put(
	"/:id",
	auth,
	authorize(PERMISSIONS.EDIT_IDEA),
	validateRequest(ideaSchemas.update),
	updateIdea
);

/**
 * @swagger
 * /ideas/{id}:
 *   delete:
 *     summary: Delete an idea
 *     tags: [Ideas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Idea deleted successfully
 */
router.delete("/:id", auth, authorize(PERMISSIONS.DELETE_IDEA), deleteIdea);

/**
 * @swagger
 * /ideas/{id}/approve:
 *   post:
 *     summary: Approve an idea
 *     tags: [Ideas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Idea approved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Idea'
 */
router.post(
	"/:id/approve",
	auth,
	authorize(PERMISSIONS.APPROVE_IDEA),
	approveIdea
);

/**
 * @swagger
 * /ideas/{id}/vote:
 *   post:
 *     summary: Vote on an idea
 *     tags: [Ideas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Vote recorded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Idea'
 */
router.post("/:id/vote", auth, voteIdea);

/**
 * @swagger
 * /ideas/{id}/comment:
 *   post:
 *     summary: Add a comment to an idea
 *     tags: [Ideas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       201:
 *         description: Comment added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Idea'
 */
router.post(
	"/:id/comment",
	auth,
	validateRequest(ideaSchemas.comment),
	addComment
);

/**
 * @swagger
 * /ideas/{id}/versions:
 *   get:
 *     summary: Get all versions of an idea
 *     tags: [Ideas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of idea versions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/IdeaVersion'
 */
router.get("/:id/versions", auth, getIdeaVersions);

export default router;
