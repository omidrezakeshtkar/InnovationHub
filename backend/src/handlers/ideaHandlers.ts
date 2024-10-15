/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from "express";
import {
	Idea,
	User,
	Comment,
	Notification,
	Category,
	IdeaVersion,
} from "../models";
import {
	sendIdeaApprovalEmail,
	sendNewCommentEmail,
} from "../services/emailService";
import { awardPoints } from "../services/gamificationService";
import { Token } from "../schemas/User.schema";
import { Idea as IdeaType, IdeaCreate } from "../schemas/Idea.schema";
import logger from "../utils/logger";
import { AppError } from "../middleware/errorHandler";
import config from "../config";
import jwt from "jsonwebtoken";
import mongoose, { ObjectId } from "mongoose";
import { PERMISSIONS } from "../config/permissions";
import { getTokenPayload } from "../utils/getTokenPayload";
import { getUserById } from "../utils/getUserById";

export const getIdeas = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const limit = parseInt(req.query.limit as string) || 10;
		const offset = parseInt(req.query.offset as string) || 0;

		const ideas = await Idea.find({ status: { $ne: "pending_approval" } })
			.populate("author", "name")
			.populate("category", "name")
			.skip(offset)
			.limit(limit);

		const totalCount = await Idea.countDocuments({ status: { $ne: "pending_approval" } });

		res.json({
			ideas,
			totalCount,
			limit,
			offset
		});
	} catch (error) {
		logger.error(`Error fetching ideas: ${error}`);
		return next(new AppError("Error fetching ideas", 500));
	}
};

export const getIdeaById = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const idea = await Idea.findOne({
			_id: id,
			status: { $ne: "pending_approval" },
		})
			.populate("author", "name")
			.populate("category", "name")
			.populate("comments");

		if (!idea) {
			logger.warn(`Idea not found with id: ${id}`);
			return next(new AppError("Idea not found", 404));
		}

		res.json(idea);
	} catch (error) {
		logger.error(`Error fetching idea: ${error}`);
		return next(new AppError("Error fetching idea", 500));
	}
};

export const createIdea = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const decoded = getTokenPayload(req, res, next) as Token["payload"];

		const { title, description, categoryId, tags, coAuthors } = req.body;
		const authorId = new mongoose.Types.ObjectId(decoded._id);

		const category = await Category.findById(categoryId);
		if (!category) {
			logger.warn(`Invalid category id: ${categoryId}`);
			return next(new AppError("Invalid category", 400));
		}

		const newIdea = new Idea({
			title,
			description,
			author: authorId,
			category: categoryId,
			department: decoded.department,
			tags,
			status: "pending_approval",
			coAuthors: coAuthors
				? coAuthors.map((id: string) => new mongoose.Types.ObjectId(id))
				: [],
		});

		await newIdea.save();

		const updatedUser = await awardPoints(authorId, 10);

		if (process.env.NODE_ENV === "development") {
			logger.debug(`New idea created: ${JSON.stringify(newIdea)}`);
			logger.debug(`Updated user points: ${updatedUser?.points}`);
		}

		res.status(201).json({ idea: newIdea, userPoints: updatedUser?.points });
	} catch (error) {
		logger.error(`Error creating idea: ${error}`);
		return next(new AppError("Error creating idea", 500));
	}
};

export const updateIdea = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const { title, description } = req.body;

		const decoded = getTokenPayload(req, res, next) as Token["payload"];
		const userId = new mongoose.Types.ObjectId(decoded._id);

		const idea = await Idea.findOne({
			_id: id,
			status: { $ne: "pending_approval" },
			$or: [{ author: userId }, { coAuthors: userId }],
		});

		if (!idea) {
			logger.warn(`Idea not found or unauthorized for id: ${id}`);
			return next(new AppError("Idea not found or unauthorized", 404));
		}

		const newVersion = new IdeaVersion({
			idea: idea._id,
			title: title || idea.title,
			description: description || idea.description,
			updatedBy: userId,
			versionNumber: idea.currentVersion + 1,
		});

		await newVersion.save();

		if (!idea.coAuthors.some((coAuthor) => coAuthor.equals(userId))) {
			idea.coAuthors.push(userId);
		}

		idea.title = title || idea.title;
		idea.description = description || idea.description;
		idea.currentVersion += 1;

		await idea.save();

		if (process.env.NODE_ENV === "development") {
			logger.debug(`Idea updated: ${JSON.stringify(idea)}`);
		}

		res.json(idea);
	} catch (error) {
		logger.error(`Error updating idea: ${error}`);
		return next(new AppError("Error updating idea", 500));
	}
};

export const deleteIdea = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const decoded = getTokenPayload(req, res, next) as Token["payload"];
		const userId = new mongoose.Types.ObjectId(decoded._id);

		const user = await getUserById(req, res, next, userId);
		const hasAccess =
			decoded.isOwner ||
			decoded.isAdmin ||
			user?.permissions?.includes(PERMISSIONS.APPROVE_IDEA);

		let idea;
		if (hasAccess) {
			idea = await Idea.findByIdAndDelete(id);
		} else {
			idea = await Idea.findOneAndDelete({
				_id: id,
				author: userId,
				status: { $ne: "pending_approval" },
			});
		}

		if (!idea) {
			logger.warn(`Idea not found or unauthorized for deletion, id: ${id}`);
			return next(new AppError("Idea not found or unauthorized", 404));
		}

		if (process.env.NODE_ENV === "development") {
			logger.debug(`Idea deleted: ${id}`);
		}

		res.json({ message: "Idea deleted successfully" });
	} catch (error) {
		logger.error(`Error deleting idea: ${error}`);
		return next(new AppError("Error deleting idea", 500));
	}
};

export const approveIdea = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;

		const decoded = getTokenPayload(req, res, next) as Token["payload"];
		const userId = new mongoose.Types.ObjectId(decoded._id);

		const user = await getUserById(req, res, next, userId);
		const hasAccess =
			decoded.isOwner ||
			decoded.isAdmin ||
			user?.permissions?.includes(PERMISSIONS.APPROVE_IDEA);

		if (!hasAccess) {
			return next(new AppError("Unauthorized to approve ideas", 403));
		}

		const idea = await Idea.findByIdAndUpdate(
			id,
			{ status: "approved" },
			{ new: true, runValidators: true }
		).populate("author");

		if (!idea) {
			logger.warn(`Idea not found for approval, id: ${id}`);
			return next(new AppError("Idea not found", 404));
		}

		const author = await getUserById(req, res, next, idea.author);

		if (!author) {
			logger.warn(`Author not found for idea, id: ${id}`);
			return next(new AppError("Author not found", 404));
		}

		await sendIdeaApprovalEmail(author.email, idea.title);

		await Notification.create({
			recipient: author._id,
			content: `Your idea "${idea.title}" has been approved.`,
			type: "idea_approved",
			relatedIdea: idea._id,
		});

		if (process.env.NODE_ENV === "development") {
			logger.debug(`Idea approved: ${JSON.stringify(idea)}`);
		}

		res.json(idea);
	} catch (error) {
		logger.error(`Error approving idea: ${error}`);
		return next(new AppError("Error approving idea", 500));
	}
};

export const voteIdea = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const { vote } = req.body;
		const decoded = getTokenPayload(req, res, next) as Token["payload"];
		const userId = new mongoose.Types.ObjectId(decoded._id);

		const idea = await Idea.findOne({
			_id: id,
			status: { $ne: "pending_approval" },
		});

		if (!idea) {
			logger.warn(`Idea not found for voting, id: ${id}`);
			return next(new AppError("Idea not found", 404));
		}

		// Check if the user has already voted
		const existingVote = idea.userVotes.find((v) => v.userId.equals(userId));

		if (existingVote) {
			// If the user has already voted, update the vote
			if (existingVote.vote !== vote) {
				if (vote === "up") {
					idea.votes += 1;
					idea.devotes -= existingVote.vote === "down" ? 1 : 0;
				} else {
					idea.devotes += 1;
					idea.votes -= existingVote.vote === "up" ? 1 : 0;
				}
				existingVote.vote = vote;
			}
		} else {
			// If the user hasn't voted yet, add their vote
			idea.userVotes.push({ userId, vote });
			if (vote === "up") {
				idea.votes += 1;
			} else {
				idea.devotes += 1;
			}
		}

		idea.netVotes = idea.votes - idea.devotes;

		await idea.save();

		const updatedUser = await awardPoints(userId, vote === "up" ? 1 : -1);

		if (process.env.NODE_ENV === "development") {
			logger.debug(`Vote ${vote} added to idea: ${id}`);
			logger.debug(`Updated user points: ${updatedUser?.points}`);
		}

		res.json({ idea, userPoints: updatedUser?.points });
	} catch (error) {
		logger.error(`Error voting for idea: ${error}`);
		return next(new AppError("Error voting for idea", 500));
	}
};

export const addComment = async (
	req: Request<{ _id: string }, {}, { content: string }>,
	res: Response,
	next: NextFunction
) => {
	try {
		const { _id } = req.params;
		const { content } = req.body;
		const decoded = getTokenPayload(req, res, next) as Token["payload"];
		const userId = new mongoose.Types.ObjectId(decoded._id);

		if (!userId) {
			return next(new AppError("User not authenticated", 401));
		}

		const idea = await Idea.findOne({
			_id: _id,
			status: { $ne: "pending_approval" },
		}).populate("author");
		if (!idea) {
			logger.warn(`Idea not found for comment, id: ${_id}`);
			return next(new AppError("Idea not found", 404));
		}

		const comment = new Comment({
			content,
			author: userId,
			idea: _id,
		});

		await comment.save();

		const updatedUser = await awardPoints(userId, 5);

		const authorId = (idea.author as any)._id;
		if (!userId.equals(authorId)) {
			const authorEmail = (idea.author as any).email;
			await sendNewCommentEmail(
				authorEmail,
				idea.title,
				(req as any).user?.name || "A user"
			);

			await Notification.create({
				recipient: authorId,
				content: `${
					(req as any).user?.name || "A user"
				} commented on your idea "${idea.title}".`,
				type: "new_comment",
				relatedIdea: idea._id,
			});
		}

		if (process.env.NODE_ENV === "development") {
			logger.debug(`Comment added to idea: ${_id}`);
			logger.debug(`Updated user points: ${updatedUser?.points}`);
		}

		res.status(201).json({ comment, userPoints: updatedUser?.points });
	} catch (error) {
		logger.error(`Error adding comment: ${error}`);
		return next(new AppError("Error adding comment", 500));
	}
};

export const getIdeaVersions = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const versions = await IdeaVersion.find({ idea: id }).sort({
			versionNumber: -1,
		});
		res.json(versions);
	} catch (error) {
		logger.error(`Error fetching idea versions: ${error}`);
		return next(new AppError("Error fetching idea versions", 500));
	}
};

export const getIdeaByIdOrTitle = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { _id, title } = req.query;

		let ideas: IdeaType[] = [];
		if (_id) {
			const idea = await Idea.findOne({
				_id: _id,
				status: { $ne: "pending_approval" },
			})
				.populate("author", "name")
				.populate("category", "name");
			if (idea) ideas.push(idea.toObject() as IdeaType);
		} else if (title) {
			const titleRegex = new RegExp(title as string, "i");
			const foundIdeas = await Idea.find({
				title: { $regex: titleRegex },
				status: { $ne: "pending_approval" },
			})
				.populate("author", "name")
				.populate("category", "name")
				.limit(10); // Limit the number of similar ideas to return
			ideas = foundIdeas.map((idea) => idea.toObject() as IdeaType);
		}

		if (ideas.length === 0) {
			logger.warn(`No ideas found for id: ${_id} or title: ${title}`);
			return next(new AppError("No ideas found", 404));
		}

		if (process.env.NODE_ENV === "development") {
			logger.debug(`Ideas fetched: ${JSON.stringify(ideas)}`);
		}

		res.json(ideas);
	} catch (error) {
		logger.error(`Error fetching ideas: ${error}`);
		return next(new AppError("Error fetching ideas", 500));
	}
};

export const getPendingApprovalIdeas = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const pendingIdeas = await Idea.find({ status: "pending_approval" })
			.populate("author", "name")
			.populate("category", "name");

		res.json(pendingIdeas);
	} catch (error) {
		logger.error(`Error fetching pending approval ideas: ${error}`);
		return next(new AppError("Error fetching pending approval ideas", 500));
	}
};

export const getIdeasByUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const decoded = getTokenPayload(req, res, next) as Token["payload"];
		const userId = new mongoose.Types.ObjectId(decoded._id);

		const ideas = await Idea.find({ author: userId })
			.populate("category", "name")
			.sort({ createdAt: -1 });

		if (process.env.NODE_ENV === "development") {
			logger.debug(`Fetched ideas for user: ${userId}`);
		}

		res.json(ideas);
	} catch (error) {
		logger.error(`Error fetching user ideas: ${error}`);
		return next(new AppError("Error fetching user ideas", 500));
	}
};

export const getIdeaComments = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { _id: ideaId } = req.params;
		const { limit = 10, offset = 0 } = req.query;

		const idea = await Idea.findById(ideaId);

		if (!idea) {
			logger.warn(`Attempt to fetch comments for non-existent idea: ${ideaId}`);
			return next(new AppError("Idea not found", 404));
		}

		const limitNum = parseInt(limit as string, 10);
		const offsetNum = parseInt(offset as string, 10);

		const totalComments = await Comment.countDocuments({ idea: ideaId });

		const comments = await Comment.find({ idea: ideaId })
			.populate("author", "name")
			.sort({ createdAt: -1 })
			.skip(offsetNum)
			.limit(limitNum);

		if (process.env.NODE_ENV === "development") {
			logger.debug(
				`Fetched ${comments.length} comments for idea: ${ideaId} (Offset: ${offsetNum}, Limit: ${limitNum})`
			);
		}

		res.json({
			comments,
			totalComments,
			offset: offsetNum,
			limit: limitNum,
			hasMore: offsetNum + comments.length < totalComments,
		});
	} catch (error) {
		if (process.env.NODE_ENV === "development") {
			logger.error(`Error fetching idea comments: ${error}`);
		} else {
			logger.error("Error fetching idea comments");
		}
		return next(new AppError("Error fetching idea comments", 500));
	}
};

// Example usage in a handler
// const userId = new mongoose.Types.ObjectId(req.body.userId);
