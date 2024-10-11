import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config";
import redisClient from "../utils/redisClient";
import { IUser } from "../models/User"; // Adjust this import path as necessary

export async function auth(req: Request, res: Response, next: NextFunction) {
	const token = req.headers["authorization"]?.split(" ")[1];

	if (!token) {
		return res.status(401).json({ message: "No token provided" });
	}

	try {
		const tokenExists = await redisClient.exists(token);
		if (!tokenExists) {
			return res.status(401).json({ message: "Invalid session" });
		}

		jwt.verify(token, config.jwtSecret, (err, decoded) => {
			if (err) {
				return res.status(403).json({ message: "Failed to authenticate token" });
			}
			(req as any).user = decoded as IUser;
			next();
		});
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error" });
	}
}

// If you need to access the user in this file
export function getUser(req: Request): IUser | undefined {
	return (req as any).user;
}
