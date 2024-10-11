import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";

export const validateRequest =
	(schema: AnyZodObject) =>
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			await schema.parseAsync({
				body: req.body,
				query: req.query,
				params: req.params,
			});
			return next();
		} catch (error) {
			if (error instanceof ZodError) {
				return res.status(400).json({
					message: "Validation Error",
					errors: error.errors,
				});
			}
			// Handle other types of errors
			return res.status(500).json({
				message: "Internal Server Error",
			});
		}
	};
