import { Request, Response } from 'express';
import { analyticsService } from '../services/analyticsService';
import { Idea, User } from '../models'; // Adjust imports based on your models

// Handler for overall analytics
export const getOverallAnalytics = async (req: Request, res: Response) => {
    try {
        const totalIdeas = await Idea.countDocuments();
        const totalUsers = await User.countDocuments();
        const totalVotes = await Idea.aggregate([{ $group: { _id: null, totalVotes: { $sum: "$votes" } } }]);

        res.status(200).json({
            totalIdeas,
            totalUsers,
            totalVotes: totalVotes[0]?.totalVotes || 0,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving overall analytics', error });
    }
};

// Handler for user engagement analytics
export const getUserEngagementAnalytics = async (req: Request, res: Response) => {
    try {
        const activeUsers = await User.countDocuments({ lastActive: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }); // Active in the last 30 days
        const engagementRate = (activeUsers / await User.countDocuments()) * 100; // Example calculation

        res.status(200).json({
            activeUsers,
            engagementRate,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user engagement analytics', error });
    }
};

// Handler for idea trends analytics
export const getIdeaTrendsAnalytics = async (req: Request, res: Response) => {
    try {
        const trendingIdeas = await Idea.find().sort({ votes: -1 }).limit(5); // Top 5 ideas by votes

        res.status(200).json({
            trendingIdeas,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving idea trends analytics', error });
    }
};

// Handler for category analytics
export const getCategoryAnalytics = async (req: Request, res: Response) => {
    try {
        const categoryStats = await Idea.aggregate([
            { $group: { _id: "$category", ideasSubmitted: { $sum: 1 } } },
            { $project: { category: "$_id", ideasSubmitted: 1, _id: 0 } }
        ]);

        res.status(200).json({
            categoryStats,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving category analytics', error });
    }
};

export const getAnalytics = async (req: Request, res: Response) => {
  try {
    const overallStats = await analyticsService.getOverallStats();
    const topCategories = await analyticsService.getTopCategories();
    const userEngagement = await analyticsService.getUserEngagement();
    const ideaTrends = await analyticsService.getIdeaTrends();

    res.json({
      overallStats,
      topCategories,
      userEngagement,
      ideaTrends
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching analytics data' });
  }
};