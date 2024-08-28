import { Request, Response } from "express";
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

export const getIdeas = async (req: Request, res: Response) => {
	try {
		const ideas = await Idea.find()
			.populate("author", "name")
			.populate("category", "name");
		res.json(ideas);
	} catch (error) {
		res.status(500).json({ message: "Error fetching ideas" });
	}
};

export const getIdeaById = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const idea = await Idea.findById(id)
			.populate("author", "name")
			.populate("category", "name")
			.populate("comments");

		if (!idea) {
			return res.status(404).json({ message: "Idea not found" });
		}

		res.json(idea);
	} catch (error) {
		res.status(500).json({ message: "Error fetching idea" });
	}
};

export const createIdea = async (req: Request, res: Response) => {
	try {
		const { title, description, categoryId, department, tags } = req.body;
		const authorId = (req as any).user.id;

		const category = await Category.findById(categoryId);
		if (!category) {
			return res.status(400).json({ message: "Invalid category" });
		}

		const newIdea = new Idea({
			title,
			description,
			author: authorId,
			category: categoryId,
			department,
			tags,
		});

		await newIdea.save();

		// Award points for creating an idea
		const updatedUser = await awardPoints(authorId, 10);

		res.status(201).json({ idea: newIdea, userPoints: updatedUser?.points });
	} catch (error) {
		res.status(500).json({ message: "Error creating idea" });
	}
};

export const updateIdea = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const { title, description } = req.body;
		const userId = (req as any).user.id;

		const idea = await Idea.findOne({
			_id: id,
			$or: [{ author: userId }, { coAuthors: userId }],
		});

		if (!idea) {
			return res
				.status(404)
				.json({ message: "Idea not found or unauthorized" });
		}

		// Create a new version
		const newVersion = new IdeaVersion({
			idea: idea._id,
			title: title || idea.title,
			description: description || idea.description,
			updatedBy: userId,
			versionNumber: idea.currentVersion + 1,
		});

		await newVersion.save();

		// Update the idea
		idea.title = title || idea.title;
		idea.description = description || idea.description;
		idea.currentVersion += 1;

		await idea.save();

		res.json(idea);
	} catch (error) {
		res.status(500).json({ message: "Error updating idea" });
	}
};

export const deleteIdea = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const userId = (req as any).user.id;

		const idea = await Idea.findOneAndDelete({ _id: id, author: userId });

		if (!idea) {
			return res
				.status(404)
				.json({ message: "Idea not found or unauthorized" });
		}

		res.json({ message: "Idea deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: "Error deleting idea" });
	}
};

export const approveIdea = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const idea = await Idea.findByIdAndUpdate(
			id,
			{ status: "approved" },
			{ new: true, runValidators: true }
		).populate("author");

		if (!idea) {
			return res.status(404).json({ message: "Idea not found" });
		}

		// Send email notification
		await sendIdeaApprovalEmail((idea.author as any).email, idea.title);

		// Create notification
		await Notification.create({
			recipient: (idea.author as any)._id,
			content: `Your idea "${idea.title}" has been approved.`,
			type: "idea_approved",
			relatedIdea: idea._id,
		});

		res.json(idea);
	} catch (error) {
		res.status(500).json({ message: "Error approving idea" });
	}
};

export const voteIdea = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const userId = (req as any).user.id;

		const idea = await Idea.findByIdAndUpdate(
			id,
			{ $inc: { votes: 1 } },
			{ new: true }
		);

		if (!idea) {
			return res.status(404).json({ message: "Idea not found" });
		}

		// Award points for voting
		const updatedUser = await awardPoints(userId, 1);

		res.json({ idea, userPoints: updatedUser?.points });
	} catch (error) {
		res.status(500).json({ message: "Error voting for idea" });
	}
};

export const addComment = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const { content } = req.body;
		const userId = (req as any).user.id;

		const idea = await Idea.findById(id).populate("author");
		if (!idea) {
			return res.status(404).json({ message: "Idea not found" });
		}

		const comment = new Comment({
			content,
			author: userId,
			idea: id,
		});

		await comment.save();

		// Award points for commenting
		const updatedUser = await awardPoints(userId, 5);

		// Send email notification if the commenter is not the idea author
		if (userId.toString() !== (idea.author as any)._id.toString()) {
			await sendNewCommentEmail(
				(idea.author as any).email,
				idea.title,
				(req as any).user.name
			);

			// Create notification
			await Notification.create({
				recipient: (idea.author as any)._id,
				content: `${(req as any).user.name} commented on your idea "${
					idea.title
				}".`,
				type: "new_comment",
				relatedIdea: idea._id,
			});
		}

		res.status(201).json({ comment, userPoints: updatedUser?.points });
	} catch (error) {
		res.status(500).json({ message: "Error adding comment" });
	}
};

export const getIdeaVersions = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const versions = await IdeaVersion.find({ idea: id }).sort({
			versionNumber: -1,
		});
		res.json(versions);
	} catch (error) {
		res.status(500).json({ message: "Error fetching idea versions" });
	}
};
