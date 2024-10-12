import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";
import logger from "../utils/logger";
import { AppError } from "./errorHandler";

export const validateRequest =
	(schema: AnyZodObject) =>
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			await schema.parseAsync({
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				body: req.body,
				query: req.query,
				params: req.params,
			});
			if (process.env.NODE_ENV === "development") {
				logger.info(
					`Request validation passed for ${req.method} ${req.originalUrl}`
				);
			}
			next();
		} catch (error) {
			if (error instanceof ZodError) {
				if (process.env.NODE_ENV === "development") {
					logger.warn(
						`Validation error for ${req.method} ${
							req.originalUrl
						}: ${JSON.stringify(error.errors)}`
					);
				}
				return res.status(400).json({
					message: "Validation Error",
					errors: error.errors,
				});
			}
			// Handle other types of errors
			if (process.env.NODE_ENV === "development") {
				logger.error(
					`Unexpected error in validateRequest middleware: ${error as Error}`
				);
			} else {
				logger.error("Unexpected error in validateRequest middleware");
			}
			next(new AppError("Internal Server Error", 500));
		}
	};
