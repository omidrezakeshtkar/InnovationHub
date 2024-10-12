/* eslint-disable @typescript-eslint/no-unused-vars */

import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { MemoryStore } from "express-rate-limit";
import redisClient from "../utils/redisClient";
import config from "../config";

const isDevelopment = config.nodeEnv === "development";

const createRateLimiter = (windowMs: number, max: number, message: string) => {
	return rateLimit({
		windowMs,
		max: isDevelopment ? Number.MAX_SAFE_INTEGER : max, // No limit in development
		standardHeaders: true,
		legacyHeaders: false,
		message,
		store: isDevelopment
			? new MemoryStore()
			: new RedisStore({
					sendCommand: async (...args: string[]) =>
						await redisClient.sendCommand(args),
			  }),
		skipFailedRequests: true,
		skip: (req) => isDevelopment, // Skip rate limiting in development
	});
};

export const apiLimiter = createRateLimiter(
	15 * 60 * 1000, // 15 minutes
	100, // 100 requests per 15 minutes
	"Too many requests from this IP, please try again after 15 minutes"
);

export const authLimiter = createRateLimiter(
	10 * 60 * 1000, // 10 minutes
	5, // 5 login attempts per 10 minutes
	"Too many login attempts from this IP, please try again after 10 minutes"
);

export const refreshTokenLimiter = createRateLimiter(
	5 * 1000, // 5 seconds
	3, // 3 requests per 5 seconds
	"Too many refresh token attempts, please try again later"
);

// Aggressive rate limiter for potential abuse
export const aggressiveLimiter = createRateLimiter(
	5 * 60 * 1000, // 5 minutes
	5, // 5 requests per 5 minutes
	"Too many requests. You have been temporarily blocked. Please try again later."
);
