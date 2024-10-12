import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../models/User";
import { AppError } from "../middleware/errorHandler";
import jwt from "jsonwebtoken";
import config from "../config";
import { ROLE_PERMISSIONS } from "../config/permissions";
import logger from "../utils/logger";
import { GetUser, UserUpdate } from "../schemas/User.schema";
import { getUserById, IUserDetails } from "../utils/getUserById";
import { convertIUserToIUserDetails } from "../utils/convertIUserToIUserDetails";

export const register = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		// Implementation
	} catch (error) {
		next(new AppError("Error in user registration", 500));
	}
};

export const login = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		// Implementation
	} catch (error) {
		next(new AppError("Error in user login", 500));
	}
};

export const logout = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		// Implementation
	} catch (error) {
		next(new AppError("Error in user logout", 500));
	}
};

export const refreshToken = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		// Implementation
	} catch (error) {
		next(new AppError("Error in refreshing token", 500));
	}
};

// Handler to get the authenticated user's profile
export const getUserProfile = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const loggedInUser = (req as any).user;
		const requestedUserId = req.body.id || loggedInUser.id;

		let user;

		if (
			loggedInUser.role === "admin" ||
			(loggedInUser.role === "owner" && requestedUserId !== loggedInUser.id)
		) {
			// Admin owner requesting another user's profile
			user = await getUserById(req, res, next, requestedUserId);
			if (!user) {
				return next(new AppError("User not found", 404));
			}
		} else {
			// User requesting their own profile
			user = await getUserById(req, res, next, loggedInUser.id);
			if (!user) {
				return next(new AppError("User not found", 404));
			}
		}

		// Check and update permissions if necessary
		const expectedPermissions =
			ROLE_PERMISSIONS[user.role as keyof typeof ROLE_PERMISSIONS];
		if (
			JSON.stringify(user.permissions) !== JSON.stringify(expectedPermissions)
		) {
			user.permissions = expectedPermissions;
			await User.updateOne(
				{ _id: user._id },
				{ $set: { permissions: expectedPermissions } }
			);
		}

		// Check if user is deleted
		if ((user as IUser).isDeleted) {
			return res.json({
				...(user as IUser).toObject(),
				message: "This user account has been deleted",
			});
		}

		res.json(user);
	} catch (error) {
		logger.error("Error fetching user profile:", error);
		next(new AppError("Error fetching user profile", 500));
	}
};

// Handler to update the authenticated user's profile
export const updateUserProfile = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		let user: any;
		const { name, role, department, email } = req.body as Partial<
			UserUpdate["body"]
		>;
		let userId = req.body as Partial<GetUser["id"]>;
		const token = req.headers.authorization?.split(" ")[1];
		if (!token) {
			return next(new AppError("Unauthorized", 401));
		}

		interface DecodedToken {
			isOwner: boolean;
		}

		const decoded = jwt.verify(token, config.accessTokenSecret) as DecodedToken;

		// If the request includes an email and the user is an owner, update the profile of the user with the provided email
		if (email && decoded.isOwner) {
			const userToUpdate = await User.findOne({ email: email });
			if (!userToUpdate) {
				return next(new AppError("User not found", 404));
			}
			userId = userToUpdate.id as string;

			user = await getUserById(req, res, next, userId);
		}

		// Check if the user is trying to change the role or department
		if (role || department) {
			if (!decoded.isOwner) {
				return next(
					new AppError("Only owners can change roles or departments", 403)
				);
			}

			if (role === "owner") {
				return next(new AppError("Only owners can assign the owner role", 403));
			}

			// Check if the role is being changed from 'owner' to another role
			if (user && user.role === "owner") {
				const ownerCount = await User.countDocuments({ role: "owner" });
				if (ownerCount <= 1) {
					return next(new AppError("Cannot remove the last owner", 403));
				}
			}
		}

		const updateFields: { [key: string]: any } = {};
		if (name) updateFields.name = name;
		if (role) updateFields.role = role;
		if (department) updateFields.department = department;

		user = await User.findOneAndUpdate(
			{ _id: userId },
			{ $set: updateFields },
			{ new: true, runValidators: true }
		).select("-password");

		if (!user) {
			return next(new AppError("User not found", 404));
		}

		// Check and update permissions if necessary
		const expectedPermissions =
			ROLE_PERMISSIONS[user.role as keyof typeof ROLE_PERMISSIONS];
		if (
			JSON.stringify(user.permissions) !== JSON.stringify(expectedPermissions)
		) {
			await User.updateOne(
				{ _id: userId },
				{ $set: { permissions: expectedPermissions } }
			);
			user.permissions = expectedPermissions;
		}

		res.json(user);
	} catch (error) {
		logger.error("Error updating user profile:", error);
		next(new AppError("Error updating user profile", 500));
	}
};

export const getAllUsers = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const users = await User.find().select("-password");
		res.json(users);
	} catch (error) {
		next(new AppError("Error fetching users", 500));
	}
};

// Handler to delete a user by ID
export const deleteUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const userId = (req as any).user as Partial<GetUser["id"]>;
		const userToDeleteId = req.params.id || userId;
		if (!userToDeleteId) {
			return next(new AppError("User ID to delete is required", 400));
		}

		const requestingUser = await getUserById(req, res, next, userToDeleteId);

		if (!requestingUser) {
			return next(new AppError("Requesting user not found", 404));
		}

		// Check if the user is trying to delete themselves or if they have the necessary permissions
		if (
			userId !== userToDeleteId &&
			requestingUser.role !== "admin" &&
			requestingUser.role !== "owner"
		) {
			return next(new AppError("Unauthorized to delete this user", 403));
		}

		const userToDelete = await User.findById(userToDeleteId);

		if (!userToDelete) {
			return next(new AppError("User to delete not found", 404));
		}

		// Update the user record with deletion information
		await User.findByIdAndUpdate(userToDeleteId, {
			isDeleted: true,
			deletedAt: new Date(),
			originalEmail: userToDelete.email,
			email: `deleted_${userToDelete._id as string}@example.com`,
			name: "Deleted User",
			password: "DELETED",
			// Add any other fields that should be anonymized
		});

		res.status(200).json({ message: "User deleted successfully" });
	} catch (error) {
		logger.error("Error deleting user:", error);
		next(new AppError("Error deleting user", 500));
	}
};

// Handler to get all users with unassigned department
export const getUsersWithUnassignedDepartment = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const users = await User.find({
			department: "This section will be filled by the department head",
		});

		res.json(users.map(convertIUserToIUserDetails));
	} catch (error) {
		logger.error("Error fetching users with unassigned department:", error);
		return next(new AppError("Error fetching users", 500));
	}
};
