import { Idea, User, Comment } from '../models';

export const analyticsService = {
  async getOverallStats() {
    const totalIdeas = await Idea.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalComments = await Comment.countDocuments();

    return { totalIdeas, totalUsers, totalComments };
  },

  async getTopCategories() {
    return Idea.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'category' } },
      { $unwind: '$category' },
      { $project: { _id: 0, name: '$category.name', count: 1 } }
    ]);
  },

  async getUserEngagement() {
    const activeUsers = await User.countDocuments({ 'lastActivity': { $gte: new Date(Date.now() - 30*24*60*60*1000) } });
    const topContributors = await Idea.aggregate([
      { $group: { _id: '$author', ideaCount: { $sum: 1 } } },
      { $sort: { ideaCount: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $project: { _id: 0, name: '$user.name', ideaCount: 1 } }
    ]);

    return { activeUsers, topContributors };
  },

  async getIdeaTrends() {
    const last30Days = new Date(Date.now() - 30*24*60*60*1000);
    return Idea.aggregate([
      { $match: { createdAt: { $gte: last30Days } } },
      { $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 }
      } },
      { $sort: { _id: 1 } }
    ]);
  }
};