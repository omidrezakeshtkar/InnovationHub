import { Request, Response, NextFunction } from "express";
import { Permission as TPermission } from "../config/permissions"; // Adjust the path as necessary
import { getUser } from "./auth";
import logger from "../utils/logger";
import { AppError } from "./errorHandler";

export const authorize = (permission: TPermission) => {
	return (req: Request, res: Response, next: NextFunction) => {
		try {
			const user = getUser(req);

			if (!user) {
				logger.warn(
					`Authorization failed: User not authenticated for ${req.originalUrl}`
				);
				throw new AppError("Forbidden: User not authenticated.", 403);
			}

			if (!user.permissions.includes(permission)) {
				if (process.env.NODE_ENV === "development") {
					logger.warn(
						`Authorization failed: User lacks permission ${permission} for ${req.originalUrl}`
					);
				} else {
					logger.warn(
						`Authorization failed: Permission denied for ${req.originalUrl}`
					);
				}
				throw new AppError(
					"Forbidden: You do not have permission to access this resource.",
					403
				);
			}

			if (process.env.NODE_ENV === "development") {
				logger.info(
					`User authorized with permission ${permission} for ${req.originalUrl}`
				);
			}

			next();
		} catch (error) {
			if (error instanceof AppError) {
				res.status(error.statusCode).json({ error: error.message });
			} else {
				if (process.env.NODE_ENV === "development") {
					logger.error(
						`Unexpected error in authorize middleware: ${error as Error}`
					);
				} else {
					logger.error("Unexpected error in authorize middleware");
				}
				next(error);
			}
		}
	};
};
