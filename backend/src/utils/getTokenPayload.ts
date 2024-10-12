import jwt from "jsonwebtoken";
import config from "../config";
import { Token } from "../schemas/User.schema";
import { Request, Response, NextFunction } from "express";
import logger from "./logger";
import { AppError } from "../middleware/errorHandler";

export const getTokenPayload = (
	req: Request,
	res: Response,
	next: NextFunction
): Token["payload"] | void => {
	const token = req.headers.authorization?.split(" ")[1];

	if (!token) {
		if (process.env.NODE_ENV === "development") {
			logger.debug("No token provided");
		}
		return next(new AppError("No token provided", 401));
	}

	try {
		const decoded = jwt.verify(
			token,
			config.accessTokenSecret
		) as Token["payload"];
		return decoded;
	} catch (error) {
		if (process.env.NODE_ENV === "development") {
			logger.debug("Invalid token");
		}
		next(new AppError("Invalid token", 401));
	}
};
