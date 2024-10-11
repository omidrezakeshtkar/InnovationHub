import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod"; // Import zod
import User from "../models/User";
import config from "../config";
import { AppError } from "../middleware/errorHandler";
import logger from "../utils/logger";
import redisClient from "../utils/redisClient";
import { RefreshTokenRequestSchema, LoginRequestSchema } from "../schemas/User.schema";
import { rateLimit } from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';

const REFRESH_TOKEN_EXPIRY = 30 * 24 * 60 * 60; // 30 days in seconds
const ACCESS_TOKEN_EXPIRY = 15 * 60; // 15 minutes in seconds

// Rate limiting for refresh token requests
export const refreshTokenLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 20, // limit each IP to 20 requests per 5 minute window
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many refresh token attempts, please try again later.',
  store: new RedisStore({
    sendCommand: (...args: string[]) => redisClient.sendCommand(args),
  }),
});

export const register = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { name, email, password, role, department } = req.body;
		const clientId = generateClientIdentifier(req);

		let user = await User.findOne({ email });
		if (user) {
			logger.warn(`Registration attempt with existing email: ${email}`);
			throw new AppError("User already exists", 400);
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		user = new User({
			name,
			email,
			password: hashedPassword,
			role,
			department,
		});

		await user.save();
		logger.info(`New user registered: ${email}`);

		const accessToken = generateAccessToken(user);
		const refreshToken = generateRefreshToken(user, clientId);

		await redisClient.set(`refresh_token:${user.id}:${clientId}`, refreshToken, {
			EX: REFRESH_TOKEN_EXPIRY,
		});

		res.status(201).json({ accessToken, refreshToken, clientId });
	} catch (error) {
		logger.error("Error in user registration:", error);
		next(error);
	}
};

function generateClientIdentifier(req: Request): string {
	const userAgent = req.headers['user-agent'] || 'Unknown';
	const host = req.headers['host'] || 'Unknown';
	const ip = req.ip || req.connection.remoteAddress || 'Unknown';
	return `${userAgent}|${host}|${ip}`;
}

export const login = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { body } = LoginRequestSchema.parse(req);
		const { email, password, rememberMe } = body;
		const clientId = generateClientIdentifier(req);

		const user = await User.findOne({ email });
		if (!user) {
			logger.warn(`Login attempt with non-existent email: ${email}`);
			throw new AppError("Invalid credentials", 400);
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			logger.warn(`Failed login attempt for user: ${email}`);
			throw new AppError("Invalid credentials", 400);
		}

		const accessToken = generateAccessToken(user);
		const refreshToken = generateRefreshToken(user, clientId);

		const expiryTime = rememberMe ? REFRESH_TOKEN_EXPIRY : 7 * 24 * 60 * 60; // 7 days if not remember me
		await redisClient.set(`refresh_token:${user.id}:${clientId}`, refreshToken, {
			EX: expiryTime,
		});

		logger.info(`User logged in: ${email}, Client ID: ${clientId}`);
		res.json({ accessToken, refreshToken });
	} catch (error) {
		if (error instanceof z.ZodError) {
			logger.warn("Invalid login request data", error);
			return res.status(400).json({ message: "Invalid request data", errors: error.errors });
		}
		logger.error("Error in user login:", error);
		next(error);
	}
};

export const refreshToken = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { body } = RefreshTokenRequestSchema.parse(req);
		const { refreshToken } = body;
		const clientId = generateClientIdentifier(req);

		if (!refreshToken || !clientId) {
			throw new AppError("Refresh token and client ID are required", 400);
		}

		const decoded = jwt.verify(refreshToken, config.refreshTokenSecret) as any;
		const storedToken = await redisClient.get(`refresh_token:${decoded.id}:${clientId}`);

		if (!storedToken || storedToken !== refreshToken) {
			// Potential token misuse, log this event
			logger.warn(`Potential misuse of refresh token for user ${decoded.id} from client ${clientId}`);
			throw new AppError("Invalid refresh token", 401);
		}

		const user = await User.findById(decoded.id);
		if (!user) {
			throw new AppError("User not found", 404);
		}

		// Implement refresh token rotation
		await redisClient.del(`refresh_token:${decoded.id}:${clientId}`);

		const newAccessToken = generateAccessToken(user);
		const newRefreshToken = generateRefreshToken(user, clientId);

		// Set a shorter expiry for the new refresh token
		const shorterExpiry = Math.min(REFRESH_TOKEN_EXPIRY, 7 * 24 * 60 * 60); // 7 days or less
		await redisClient.set(`refresh_token:${user.id}:${clientId}`, newRefreshToken, {
			EX: shorterExpiry,
		});

		logger.info(`Tokens refreshed for user: ${user.email}, Client ID: ${clientId}`);
		res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
	} catch (error) {
		if (error instanceof z.ZodError) {
			logger.warn("Invalid refresh token request data", error);
			return res.status(400).json({ message: "Invalid request data", errors: error.errors });
		}
		if (error instanceof jwt.TokenExpiredError) {
			logger.warn("Attempt to use expired refresh token");
			next(new AppError("Refresh token expired", 401));
		} else {
			logger.error("Error in token refresh:", error);
			next(error);
		}
	}
};

export const logout = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const userId = (req as any).user.id;
		await redisClient.del(`refresh_token:${userId}`);
		logger.info(`User logged out: ${userId}`);
		res.json({ message: "Logged out successfully" });
	} catch (error) {
		logger.error("Error in user logout:", error);
		next(error);
	}
};

function generateAccessToken(user: any) {
	return jwt.sign(
		{
			id: user.id,
			email: user.email,
			role: user.role,
			isAdmin: user.role === 'admin' || user.role === 'owner',
			isOwner: user.role === 'owner',
			isLoggedIn: true
		},
		config.accessTokenSecret,
		{ expiresIn: ACCESS_TOKEN_EXPIRY }
	);
}

function generateRefreshToken(user: any, clientId: string) {
	return jwt.sign(
		{ id: user.id, clientId },
		config.refreshTokenSecret,
		{ expiresIn: REFRESH_TOKEN_EXPIRY }
	);
}

// Scheduled task to remove inactive refresh tokens (run this daily)
export async function cleanupInactiveRefreshTokens() {
	try {
		const keys = await redisClient.keys("refresh_token:*");
		logger.info(`Starting cleanup of inactive refresh tokens. Total keys: ${keys.length}`);

		let deletedCount = 0;
		for (const key of keys) {
			const ttl = await redisClient.ttl(key);
			if (ttl > 0 && ttl <= REFRESH_TOKEN_EXPIRY - 7 * 24 * 60 * 60) {
				await redisClient.del(key);
				deletedCount++;
			}
		}

		logger.info(`Cleanup completed. Deleted ${deletedCount} inactive refresh tokens.`);
	} catch (error) {
		logger.error("Error during cleanup of inactive refresh tokens:", error);
	}
}

// Function to revoke all refresh tokens for a user
export const revokeAllRefreshTokens = async (userId: string) => {
	const keys = await redisClient.keys(`refresh_token:${userId}:*`);
	if (keys.length > 0) {
		await redisClient.del(keys);
		logger.info(`Revoked all refresh tokens for user: ${userId}`);
	}
};