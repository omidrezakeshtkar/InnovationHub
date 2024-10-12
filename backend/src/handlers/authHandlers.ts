import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod"; // Import zod
import User, { IUser } from "../models/User";
import config from "../config";
import { AppError } from "../middleware/errorHandler";
import logger from "../utils/logger";
import redisClient from "../utils/redisClient";
import {
	RefreshTokenRequestSchema,
	LoginRequestSchema,
	Token,
} from "../schemas/User.schema";
import { rateLimit } from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { getTokenPayload } from "../utils/getTokenPayload";
import { getUserById, IUserDetails } from "../utils/getUserById";
import { Permission } from "../config/permissions";
import { convertIUserToIUserDetails } from "../utils/convertIUserToIUserDetails";

const REFRESH_TOKEN_EXPIRY = 30 * 24 * 60 * 60; // 30 days in seconds
const ACCESS_TOKEN_EXPIRY = 15 * 60; // 15 minutes in seconds

// Rate limiting for refresh token requests
export const refreshTokenLimiter = rateLimit({
	windowMs: 5 * 60 * 1000, // 5 minutes
	max: 20, // limit each IP to 20 requests per 5 minute window
	standardHeaders: true,
	legacyHeaders: false,
	message: "Too many refresh token attempts, please try again later.",
	store: new RedisStore({
		sendCommand: async (...args: string[]) =>
			await redisClient.sendCommand(args),
	}),
});

export const register = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		if (process.env.NODE_ENV === "development") {
			logger.debug(`Register attempt`);
		}
		const { name, email, password, role, department } = req.body as IUser;
		const clientId = generateClientIdentifier(req);

		let user = await User.findOne({ email });
		if (user) {
			logger.warn(`Registration attempt with existing email`);
			return next(new AppError("User already exists", 400));
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
		logger.info(`New user registered`);

		const userDetails = convertIUserToIUserDetails(user);

		const accessToken = generateAccessToken(userDetails as IUserDetails);
		const refreshToken = generateRefreshToken(
			userDetails as IUserDetails,
			clientId
		);

		// Store both access and refresh tokens in Redis
		await redisClient.set(
			`access_token:${user.id as string}:${clientId}`,
			accessToken,
			{
				EX: ACCESS_TOKEN_EXPIRY,
			}
		);

		await redisClient.set(
			`refresh_token:${user.id as string}:${clientId}`,
			refreshToken,
			{
				EX: REFRESH_TOKEN_EXPIRY,
			}
		);

		// Do not expose clientId to the user
		res.status(201).json({ accessToken, refreshToken });
		if (process.env.NODE_ENV === "development") {
			logger.debug(`User registered successfully`);
		}
	} catch (error) {
		logger.error("Error in user registration:", error);
		return next(new AppError("Error in user registration", 500));
	}
};

export const generateClientIdentifier = (req: Request): string => {
	const userAgent = req.headers["user-agent"] ?? "Unknown";
	const host = req.headers.host ?? "Unknown";
	const ip = req.ip ?? req.socket.remoteAddress ?? "Unknown";
	return `${userAgent}|${host}|${ip}`;
};

export const login = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		if (process.env.NODE_ENV === "development") {
			logger.debug(`Login attempt`);
		}
		const { body } = LoginRequestSchema.parse(req);
		const { email, password, rememberMe } = body;
		const clientId = generateClientIdentifier(req);

		const user = await User.findOne({ email });
		if (!user) {
			logger.warn(`Login attempt with non-existent email`);
			return next(new AppError("Invalid credentials", 400));
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			logger.warn(`Failed login attempt`);
			return next(new AppError("Invalid credentials", 400));
		}

		// Pick relevant data from user and cast to IUserDetails
		const userDetails = convertIUserToIUserDetails(user);

		const accessToken = generateAccessToken(userDetails);
		const refreshToken = generateRefreshToken(userDetails, clientId);

		// Store both access and refresh tokens in Redis
		await redisClient.set(
			`access_token:${user._id as string}:${clientId}`,
			accessToken,
			{
				EX: ACCESS_TOKEN_EXPIRY,
			}
		);

		const expiryTime = rememberMe ? REFRESH_TOKEN_EXPIRY : 7 * 24 * 60 * 60; // 7 days if not remember me
		await redisClient.set(
			`refresh_token:${user._id as string}:${clientId}`,
			refreshToken,
			{
				EX: expiryTime,
			}
		);

		logger.info(`User logged in`);
		// Do not expose clientId to the user
		res.json({ accessToken, refreshToken });
		if (process.env.NODE_ENV === "development") {
			logger.debug(`User logged in successfully`);
		}
	} catch (error) {
		if (error instanceof z.ZodError) {
			logger.warn("Invalid login request data", error);
			return next(new AppError("Invalid request data", 400));
		}
		logger.error("Error in user login:", error);
		return next(new AppError("Error in user login", 500));
	}
};

export const refreshToken = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		if (process.env.NODE_ENV === "development") {
			logger.debug(`Refresh token attempt`);
		}
		const { body } = RefreshTokenRequestSchema.parse(req);
		const { refreshToken } = body;
		const clientId = generateClientIdentifier(req);

		if (!refreshToken || !clientId) {
			return next(
				new AppError("Refresh token and client ID are required", 400)
			);
		}

		const decoded = jwt.verify(
			refreshToken,
			config.refreshTokenSecret
		) as Token["payload"];
		const storedToken = await redisClient.get(
			`refresh_token:${decoded._id}:${clientId}`
		);

		if (!storedToken || storedToken !== refreshToken) {
			// Potential token misuse, log this event
			logger.warn(`Potential misuse of refresh token`);
			return next(new AppError("Invalid refresh token", 401));
		}

		const userDetails = await getUserById(req, res, next, decoded._id);

		// Implement refresh token rotation
		await redisClient.del(`refresh_token:${decoded._id}:${clientId}`);
		await redisClient.del(`access_token:${decoded._id}:${clientId}`);

		const newAccessToken = generateAccessToken(userDetails as IUserDetails);
		const newRefreshToken = generateRefreshToken(
			userDetails as IUserDetails,
			clientId
		);

		// Store new access and refresh tokens in Redis
		await redisClient.set(
			`access_token:${userDetails!._id as string}:${clientId}`,
			newAccessToken,
			{
				EX: ACCESS_TOKEN_EXPIRY,
			}
		);

		const shorterExpiry = Math.min(REFRESH_TOKEN_EXPIRY, 7 * 24 * 60 * 60); // 7 days or less
		await redisClient.set(
			`refresh_token:${userDetails!._id as string}:${clientId}`,
			newRefreshToken,
			{
				EX: shorterExpiry,
			}
		);

		logger.info(`Tokens refreshed`);
		res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
		if (process.env.NODE_ENV === "development") {
			logger.debug(`Tokens refreshed successfully`);
		}
	} catch (error) {
		if (error instanceof z.ZodError) {
			logger.warn("Invalid refresh token request data", error);
			return next(new AppError("Invalid request data", 400));
		}
		if (error instanceof jwt.TokenExpiredError) {
			logger.warn("Attempt to use expired refresh token");
			return next(new AppError("Refresh token expired", 401));
		} else {
			logger.error("Error in token refresh:", error);
			return next(new AppError("Error in token refresh", 500));
		}
	}
};

export const logout = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		if (process.env.NODE_ENV === "development") {
			logger.debug(`Logout attempt`);
		}

		// Verify the token and extract user information
		const decoded = getTokenPayload(req, res, next) as Token["payload"];

		const userId = decoded._id;
		await redisClient.del(`refresh_token:${userId}`);
		logger.info(`User logged out`);
		res.json({ message: "Logged out successfully" });
		if (process.env.NODE_ENV === "development") {
			logger.debug(`User logged out successfully`);
		}
	} catch (error) {
		logger.error("Error in user logout:", error);
		return next(new AppError("Error in user logout", 500));
	}
};

const generateAccessToken = (user: IUserDetails): string => {
	return jwt.sign(
		{
			_id: user._id.toString(),
			email: user.email,
			isAdmin: user.role === "admin" || user.role === "owner",
			isOwner: user.role === "owner",
			isLoggedIn: true,
			role: user.role,
			department: user.department,
		} as Token["payload"],
		config.accessTokenSecret, // Ensure this matches the secret used in verification
		{ expiresIn: ACCESS_TOKEN_EXPIRY }
	);
};

const generateRefreshToken = (user: IUserDetails, clientId: string): string => {
	return jwt.sign(
		{ _id: user._id.toString(), clientId },
		config.refreshTokenSecret,
		{
			expiresIn: REFRESH_TOKEN_EXPIRY,
		}
	);
};

// Scheduled task to remove inactive refresh tokens (run this daily)
export async function cleanupInactiveRefreshTokens() {
	try {
		const keys = await redisClient.keys("refresh_token:*");
		logger.info(
			`Starting cleanup of inactive refresh tokens. Total keys: ${keys.length.toString()}`
		);

		let deletedCount = 0;
		for (const key of keys) {
			const ttl = await redisClient.ttl(key);
			if (ttl > 0 && ttl <= REFRESH_TOKEN_EXPIRY - 7 * 24 * 60 * 60) {
				await redisClient.del(key);
				deletedCount++;
			}
		}

		logger.info(
			`Cleanup completed. Deleted ${deletedCount.toString()} inactive refresh tokens.`
		);
		if (process.env.NODE_ENV === "development") {
			logger.debug(
				`Cleanup details: Total keys - ${keys.length.toString()}, Deleted - ${deletedCount.toString()}`
			);
		}
	} catch (error) {
		logger.error("Error during cleanup of inactive refresh tokens:", error);
	}
}

// Function to revoke all refresh tokens for a user
export const revokeAllRefreshTokens = async (userId: string) => {
	try {
		const keys = await redisClient.keys(`refresh_token:${userId}:*`);
		if (keys.length > 0) {
			await redisClient.del(keys);
			logger.info(`Revoked all refresh tokens for a user`);
			if (process.env.NODE_ENV === "development") {
				logger.debug(
					`Revoked ${keys.length.toString()} refresh tokens for user: ${userId}`
				);
			}
		} else {
			if (process.env.NODE_ENV === "development") {
				logger.debug(`No refresh tokens found to revoke for user: ${userId}`);
			}
		}
	} catch (error) {
		logger.error(`Error revoking refresh tokens for a user:`, error);
		throw new AppError("Failed to revoke refresh tokens", 500);
	}
};
