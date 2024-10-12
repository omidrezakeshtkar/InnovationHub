import { NextFunction, Request, Response } from "express";
import { analyticsService } from "../services/analyticsService";
import { Idea, User } from "../models";
import { AppError } from "../middleware/errorHandler";
import logger from "../utils/logger";
import { IdeaSchema } from "../schemas";

// Handler for overall analytics
export const getOverallAnalytics = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const totalIdeas = await Idea.countDocuments();
		const totalUsers = await User.countDocuments();
		const totalVotes = await Idea.aggregate([
			{ $group: { _id: null, totalVotes: { $sum: "$votes" } } },
		]);

		res.status(200).json({
			totalIdeas,
			totalUsers,
			totalVotes: totalVotes[0]?.totalVotes || 0,
		});
	} catch (error: unknown) {
		if (error instanceof Error) {
			logger.error("Error retrieving overall analytics", {
				errorMessage: error.message,
			});
		}
		next(new AppError("Error retrieving overall analytics", 500));
	}
};

// Handler for user engagement analytics
export const getUserEngagementAnalytics = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
		const activeUsers = await User.countDocuments({
			lastActive: { $gte: thirtyDaysAgo },
		});
		const totalUsers = await User.countDocuments();
		const engagementRate =
			totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0;

		res.status(200).json({
			activeUsers,
			engagementRate: parseFloat(engagementRate.toFixed(2)),
		});
	} catch (error: unknown) {
		if (error instanceof Error) {
			logger.error("Error retrieving user engagement analytics", {
				errorMessage: error.message,
			});
		}
		next(new AppError("Error retrieving user engagement analytics", 500));
	}
};

// Handler for idea trends analytics
export const getIdeaTrendsAnalytics = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const trendingIdeas = await Idea.find()
			.sort({ votes: -1 })
			.limit(5)
			.select("-author -coAuthors")
			.lean();

		const sanitizedTrendingIdeas = trendingIdeas.map((idea) =>
			IdeaSchema.parse(idea)
		);

		res.status(200).json({
			trendingIdeas: sanitizedTrendingIdeas,
		});
	} catch (error: unknown) {
		if (error instanceof Error) {
			logger.error("Error retrieving idea trends analytics", {
				errorMessage: error.message,
			});
		}
		next(new AppError("Error retrieving idea trends analytics", 500));
	}
};

// Handler for category analytics
export const getCategoryAnalytics = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const categoryStats = await Idea.aggregate([
			{ $group: { _id: "$category", ideasSubmitted: { $sum: 1 } } },
			{ $project: { category: "$_id", ideasSubmitted: 1, _id: 0 } },
		]);

		res.status(200).json({
			categoryStats,
		});
	} catch (error: unknown) {
		if (error instanceof Error) {
			logger.error("Error retrieving category analytics", {
				errorMessage: error.message,
			});
		}
		next(new AppError("Error retrieving category analytics", 500));
	}
};

export const getAnalytics = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const overallStats = await analyticsService.getOverallStats();
		const topCategories = await analyticsService.getTopCategories();
		const userEngagement = await analyticsService.getUserEngagement();
		const ideaTrends = await analyticsService.getIdeaTrends();

		res.json({
			overallStats,
			topCategories,
			userEngagement,
			ideaTrends,
		});
	} catch (error: unknown) {
		if (error instanceof Error) {
			logger.error("Error fetching analytics data", {
				errorMessage: error.message,
			});
		}
		next(new AppError("Error fetching analytics data", 500));
	}
};
