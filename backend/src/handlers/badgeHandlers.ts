import { Request, Response } from 'express';
import Badge from '../models/Badge';

export const getBadges = async (req: Request, res: Response) => {
  try {
    const badges = await Badge.find();
    res.json(badges);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching badges' });
  }
};

export const createBadge = async (req: Request, res: Response) => {
  try {
    const { name, description, imageUrl, pointThreshold } = req.body;
    const newBadge = new Badge({ name, description, imageUrl, pointThreshold });
    await newBadge.save();
    res.status(201).json(newBadge);
  } catch (error) {
    res.status(500).json({ message: 'Error creating badge' });
  }
};

export const updateBadge = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, imageUrl, pointThreshold } = req.body;
    const badge = await Badge.findByIdAndUpdate(
      id,
      { name, description, imageUrl, pointThreshold },
      { new: true, runValidators: true }
    );
    if (!badge) {
      return res.status(404).json({ message: 'Badge not found' });
    }
    res.json(badge);
  } catch (error) {
    res.status(500).json({ message: 'Error updating badge' });
  }
};

export const deleteBadge = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const badge = await Badge.findByIdAndDelete(id);
    if (!badge) {
      return res.status(404).json({ message: 'Badge not found' });
    }
    res.json({ message: 'Badge deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting badge' });
  }
};