import { Permission } from "../config/permissions";
import { IUser } from "../models/User";
import { IUserDetails } from "./getUserById";

export const convertIUserToIUserDetails = (user: IUser): IUserDetails => {
	return {
		_id: user._id.toString(),
		email: user.email,
		role: user.role,
		department: user.department,
		permissions: user.permissions as Permission[],
		memberSince: user.createdAt,
	};
};
