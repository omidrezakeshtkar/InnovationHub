import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User"; // Adjust the import path
import config from "../config";
import { ROLE_PERMISSIONS } from "../config/permissions";
import { AppError } from "../middleware/errorHandler";
import logger from "../utils/logger";

export const register = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { name, email, password, role, department } = req.body;

		let user = await User.findOne({ email });
		if (user) {
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
			permissions:
				ROLE_PERMISSIONS[role as keyof typeof ROLE_PERMISSIONS] || [],
		});

		await user.save();

		const token = jwt.sign({ id: user.id }, config.jwtSecret, {
			expiresIn: "1d",
		});
		logger.info(`User registered: ${email}`);
		res.json({ token });
	} catch (error) {
		next(error);
	}
};

export const login = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { email, password } = req.body;

		const user = await User.findOne({ email });
		if (!user) {
			throw new AppError("Invalid credentials", 400);
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			throw new AppError("Invalid credentials", 400);
		}

		const token = jwt.sign({ id: user.id }, config.jwtSecret, {
			expiresIn: "1d",
		});
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
	res.json({ message: "Logged out successfully" });
};

export const refreshToken = async (req: Request, res: Response) => {
	const { refreshToken } = req.body;

	if (!refreshToken) {
		return res.status(401).json({ message: "Refresh token required" });
	}

	try {
		// Verify the refresh token
		const decoded = jwt.verify(
			refreshToken,
			process.env.REFRESH_TOKEN_SECRET as string
		); // Adjust secret as necessary
		const user = await User.findById((decoded as any).id); // Find user by ID from token

		if (!user) {
			return res.status(401).json({ message: "Invalid refresh token" });
		}

		// Generate new access token
		const newAccessToken = jwt.sign(
			{ id: user._id },
			process.env.ACCESS_TOKEN_SECRET as string,
			{ expiresIn: "15m" }
		); // Adjust expiration as necessary

		res.json({ accessToken: newAccessToken });
	} catch (error) {
		res.status(401).json({ message: "Invalid refresh token" });
	}
};
