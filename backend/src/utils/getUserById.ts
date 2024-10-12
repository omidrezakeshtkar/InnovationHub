import { Request, Response, NextFunction } from "express";
import { ObjectId } from "mongodb";
import { User } from "../models";
import config from "../config";
import { Permission } from "../config/permissions";
import { IUser } from "../models/User";
import { AppError } from "../middleware/errorHandler";
import logger from "./logger";
import { getTokenPayload } from "./getTokenPayload";

export interface IUserDetails {
	_id: ObjectId;
	email: string;
	role: string;
	department: string;
	memberSince: Date;
	permissions: Permission[];
}

export const getUserById = async (
	req: Request,
	res: Response,
	next: NextFunction,
	selector: string | ObjectId
): Promise<IUser | IUserDetails | void> => {
	try {
		const tokenPayload = getTokenPayload(req, res, next);
		if (!tokenPayload) {
			return next(new AppError("Unauthorized", 401));
		}

		let user;
		if (typeof selector === "string" && selector.includes("@")) {
			user = await User.findOne({ email: selector }).select("-password");
		} else {
			user = await User.findById(selector).select("-password");
		}

		if (!user) {
			logger.error("User not found");
			return next(new AppError("User not found", 404));
		}

		if (tokenPayload._id === user._id.toString()) {
			// If the requesting user is the same as the requested user, return full data
			return user.toObject();
		}

		if (config.nodeEnv === "development") {
			// In development, return more details for debugging
			return {
				...user.toObject(),
				_id: user._id,
				name: user.name,
				role: user.role,
				department: user.department,
				createdAt: user.createdAt,
				updatedAt: user.updatedAt,
				__v: user.__v,
			} as IUser;
		}

		// In production, return minimal GDPR-compliant data
		return {
			_id: user._id,
			email: user.email,
			role: user.role,
			department: user.department,
			memberSince: user.createdAt,
			permissions: user.permissions as Permission[],
		} as IUserDetails;
	} catch (error) {
		logger.error("Error in getUserById:", error);
		return next(new AppError("Internal Server Error", 500));
	}
};
