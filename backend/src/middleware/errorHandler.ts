import { Request, Response, NextFunction } from "express";
import { CustomError } from "../utils/CustomError";
import logger from "../utils/logger";

export class AppError extends CustomError {
	statusCode: number;

	constructor(message: string, statusCode: number) {
		super(message);
		this.statusCode = statusCode;
	}
}

export const errorHandler = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	let statusCode = 500;
	let errorMessage = "Internal Server Error";

	if (err instanceof AppError) {
		statusCode = err.statusCode;
		errorMessage = err.message;
	} else if (err instanceof CustomError) {
		statusCode = 400;
		errorMessage = err.message;
	}

	// Log the error with stack trace

	logger.error(`${err.name}: ${err.message}\n${err.stack ?? ""}`);

	// In development, send the error details including the stack trace
	if (process.env.NODE_ENV === "development") {
		res.status(statusCode).json({
			error: {
				message: errorMessage,
				stack: err.stack,
			},
		});
	} else {
		// In production, send a generic error message
		res.status(statusCode).json({ error: errorMessage });
	}

	// Call next() to ensure Express knows the error has been handled
	next();
};
