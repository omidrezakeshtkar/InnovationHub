import dotenv from "dotenv";

dotenv.config();

export default {
	port: process.env.PORT || 3000,
	nodeEnv: process.env.NODE_ENV || "development",
	databaseUrl:
		process.env.NODE_ENV === "development"
			? "mongodb://localhost:27017/ideaexchange"
			: process.env.DATABASE_URL || "mongodb://mongodb:27017/ideaexchange",
	jwtSecret: process.env.JWT_SECRET || "your-secret-key",
	email: {
		host: process.env.EMAIL_HOST || "smtp.ethereal.email",
		port: parseInt(process.env.EMAIL_PORT || "587", 10),
		secure: process.env.EMAIL_SECURE === "true",
		user: process.env.EMAIL_USER || "your_ethereal_username",
		password: process.env.EMAIL_PASSWORD || "your_ethereal_password",
		from: process.env.EMAIL_FROM || "IdeaExchange <noreply@ideaexchange.com>",
	},
	rateLimit: {
		windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10),
		max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100", 10),
	},
	logLevel: process.env.LOG_LEVEL || 'info',
	websiteUrl: process.env.WEBSITE_URL || "http://localhost:3000",
};
