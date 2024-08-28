import { Request, Response } from 'express';
import { analyticsService } from '../services/analyticsService';

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