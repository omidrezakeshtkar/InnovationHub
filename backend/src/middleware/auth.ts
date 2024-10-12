import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config";
import redisClient from "../utils/redisClient";
import { IUser } from "../models/User"; // Adjust this import path as necessary
import { generateClientIdentifier } from "../handlers/authHandlers";
import { Token } from "../schemas/User.schema";
import { AppError } from "./errorHandler";
import logger from "../utils/logger";
import User from "../models/User"; // Import the User model

export async function auth(req: Request, res: Response, next: NextFunction) {
	const token = req.headers.authorization?.split(" ")[1];

	if (!token) {
		if (process.env.NODE_ENV === "development") {
			logger.debug("No token provided");
		}
		next(new AppError("No token provided", 401));
		return; // Ensure return is used
	}

	try {
		// Verify the token and extract user information
		const decoded = jwt.verify(
			token,
			config.accessTokenSecret
		) as Token["payload"];

		if (!decoded._id) {
			throw new Error("Invalid token payload");
		}

		if (process.env.NODE_ENV === "development") {
			logger.debug(`Token verified for user: ${decoded._id}`);
		}

		// Generate clientId internally
		const clientId = generateClientIdentifier(req);

		// Check if the access token exists in Redis using clientId
		const tokenExists = await redisClient.exists(
			`access_token:${decoded._id}:${clientId}`
		);
		if (!tokenExists) {
			if (process.env.NODE_ENV === "development") {
				logger.debug(`Invalid session for user: ${decoded._id}`);
			}
			next(new AppError("Invalid session", 401));
			return; // Ensure return is used
		}

		// Load user from database and attach to request
		const user = await User.findById(decoded._id).select("-password");
		if (!user) {
			throw new AppError("User not found", 404);
		}
		(req as any).user = user;

		if (process.env.NODE_ENV === "development") {
			logger.debug(`Authentication successful for user: ${decoded._id}`);
		}

		next();
	} catch (error) {
		if (error instanceof jwt.TokenExpiredError) {
			if (process.env.NODE_ENV === "development") {
				logger.debug("Token has expired");
			}
			next(new AppError("Token has expired", 401));
			return; // Ensure return is used
		}
		if (
			error instanceof Error &&
			error.message === "Failed to authenticate token"
		) {
			if (process.env.NODE_ENV === "development") {
				logger.debug(`Failed to authenticate token: ${error.message}`);
			}
			next(new AppError(error.message, 403));
			return; // Ensure return is used
		}
		if (process.env.NODE_ENV === "development") {
			logger.error(
				`Internal Server Error: ${
					error instanceof Error ? error.message : "Unknown error"
				}`
			);
		}
		next(new AppError("Internal Server Error", 500));
		return; // Ensure return is used
	}
}

// If you need to access the user in this file
export function getUser(req: Request): IUser | undefined {
	return (req as any).user;
}
