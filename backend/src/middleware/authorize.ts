import { Request, Response, NextFunction } from "express";
import { PERMISSIONS } from "../config/permissions"; // Adjust the path as necessary
import { getUser } from "./auth";

export function authorize(requiredPermission: string) {
	return (req: Request, res: Response, next: NextFunction) => {
		const user = getUser(req);

		if (!user) {
			return res.status(403).json({ message: 'Forbidden: User not authenticated.' });
		}

		if (!user.permissions.includes(requiredPermission)) {
			return res.status(403).json({ message: 'Forbidden: You do not have permission to access this resource.' });
		}

		next();
	};
}
