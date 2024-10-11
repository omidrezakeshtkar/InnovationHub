import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import { AppError } from "../middleware/errorHandler";
import jwt from "jsonwebtoken";
import config from "../config";
import { ROLE_PERMISSIONS } from "../config/permissions";

export const register = async (req: Request, res: Response) => {
	// Implementation
};

export const login = async (req: Request, res: Response) => {
	// Implementation
};

export const logout = async (req: Request, res: Response) => {
	// Implementation
};

export const refreshToken = async (req: Request, res: Response) => {
	// Implementation
};

export const getUserProfile = async (req: Request, res: Response) => {
	try {
		// Assuming user ID is available in req.user after authentication
		const userId = (req as any).user.id;
		const user = await User.findById(userId).select("-password");

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Check and update permissions if necessary
		const expectedPermissions =
			ROLE_PERMISSIONS[user.role as keyof typeof ROLE_PERMISSIONS] || [];
		if (
			JSON.stringify(user.permissions) !== JSON.stringify(expectedPermissions)
		) {
			user.permissions = expectedPermissions;
			await user.save();
		}

		res.json(user);
	} catch (error) {
		res.status(500).json({ message: "Error fetching user profile" });
	}
};

export const updateUserProfile = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { name, role, department, email } = req.body;
		let userId = (req as any).user.id;
		const token = req.headers.authorization?.split(" ")[1];
		if (!token) {
			throw new AppError("Unauthorized", 401);
		}

		const decoded = jwt.verify(token, config.jwtSecret) as any;

		// If the request includes an email and the user is an owner, update the profile of the user with the provided email
		if (email && decoded.isOwner) {
			const userToUpdate = await User.findOne({ email });
			if (!userToUpdate) {
				throw new AppError("User not found", 404);
			}
			userId = userToUpdate.id;
		}

		// Check if the user is trying to change the role or department
		if (role || department) {
			if (!decoded.isOwner) {
				throw new AppError("Only owners can change roles or departments", 403);
			}

			if (role === "owner" && !decoded.isOwner) {
				throw new AppError("Only owners can assign the owner role", 403);
			}

			// Check if the role is being changed from 'owner' to another role
			const user = await User.findById(userId);
			if (user && user.role === "owner" && role !== "owner") {
				const ownerCount = await User.countDocuments({ role: "owner" });
				if (ownerCount <= 1) {
					throw new AppError("Cannot remove the last owner", 403);
				}
			}
		}

		const user = await User.findByIdAndUpdate(
			userId,
			{ name, role, department },
			{ new: true, runValidators: true }
		).select("-password");

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Check and update permissions if necessary
		const expectedPermissions =
			ROLE_PERMISSIONS[user.role as keyof typeof ROLE_PERMISSIONS] || [];
		if (
			JSON.stringify(user.permissions) !== JSON.stringify(expectedPermissions)
		) {
			user.permissions = expectedPermissions;
			await user.save();
		}

		res.json(user);
	} catch (error) {
		next(error);
	}
};

export const getAllUsers = async (req: Request, res: Response) => {
	try {
		const users = await User.find().select("-password");
		res.json(users);
	} catch (error) {
		res.status(500).json({ message: "Error fetching users" });
	}
};

export const deleteUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const userId = (req as any).user.id;
		const userToDeleteId = req.params.id || userId;
		const requestingUser = await User.findById(userId);

		if (!requestingUser) {
			throw new AppError("Requesting user not found", 404);
		}

		// Check if the user is trying to delete themselves or if they have the necessary permissions
		if (
			userId !== userToDeleteId &&
			requestingUser.role !== "admin" &&
			requestingUser.role !== "owner"
		) {
			throw new AppError("Unauthorized to delete this user", 403);
		}

		const userToDelete = await User.findById(userToDeleteId);

		if (!userToDelete) {
			throw new AppError("User to delete not found", 404);
		}

		// Update the user record with deletion information
		await User.findByIdAndUpdate(userToDeleteId, {
			isDeleted: true,
			deletedAt: new Date(),
			originalEmail: userToDelete.email,
			email: `deleted_${userToDelete._id}@example.com`,
			name: 'Deleted User',
			password: 'DELETED',
			// Add any other fields that should be anonymized
		});

		res.status(200).json({ message: "User deleted successfully" });
	} catch (error) {
		next(error);
	}
};
