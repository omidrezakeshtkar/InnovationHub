import User from '../models/User';
import Badge from '../models/Badge';

export const awardPoints = async (userId: string, points: number) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { $inc: { points: points } },
    { new: true }
  );

  if (user) {
    await checkAndAwardBadges(user);
  }

  return user;
};

export const checkAndAwardBadges = async (user: any) => {
  const eligibleBadges = await Badge.find({ pointThreshold: { $lte: user.points } });

  const newBadges = eligibleBadges.filter(
    badge => !user.badges.includes(badge._id)
  );

  if (newBadges.length > 0) {
    user.badges.push(...newBadges.map(badge => badge._id));
    await user.save();
  }

  return newBadges;
};