import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import config from '../config';
import { ROLE_PERMISSIONS } from '../config/permissions';
import { AppError } from '../middleware/errorHandler';
import logger from '../utils/logger';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, role, department } = req.body;
    
    let user = await User.findOne({ email });
    if (user) {
      throw new AppError('User already exists', 400);
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      department,
      permissions: ROLE_PERMISSIONS[role as keyof typeof ROLE_PERMISSIONS] || [],
    });
    
    await user.save();
    
    const token = jwt.sign({ id: user.id }, config.jwtSecret, { expiresIn: '1d' });
    logger.info(`User registered: ${email}`);
    res.json({ token });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError('Invalid credentials', 400);
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError('Invalid credentials', 400);
    }
    
    const token = jwt.sign({ id: user.id }, config.jwtSecret, { expiresIn: '1d' });
    logger.info(`User logged in: ${email}`);
    res.json({ token });
  } catch (error) {
    next(error);
  }
};

export const logout = (req: Request, res: Response) => {
  // For JWT, we don't need to do anything server-side for logout
  // The client should remove the token from storage
  logger.info(`User logged out: ${(req as any).user.email}`);
  res.json({ message: 'Logged out successfully' });
};