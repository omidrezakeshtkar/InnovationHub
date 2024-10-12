import app from "./app";
import config from "./config";
import { connectDatabase } from "./database/connection";
import { runMigrations } from "./services/migrationService";
import logger from "./utils/logger";
import redisClient from "./utils/redisClient";
import { checkEmailService } from "./services/emailService";

const PORT = config.port || 3000;

const startServer = async () => {
	try {
		logger.info("Starting server initialization...");

		await redisClient.connect();
		logger.info("Connected to Redis successfully");

		await connectDatabase();
		logger.info("Connected to database successfully");

		await runMigrations();
		logger.info("Database migrations completed successfully");

		await checkEmailService();
		logger.info("Email service is up and running");

		app.listen(PORT, () => {
			logger.info(`Server is running on port ${PORT}`);
			logger.info(`Environment: ${config.nodeEnv}`);
		});

		logger.info("Server initialization completed successfully");
	} catch (error) {
		logger.error("Failed to start server:", error);
		process.exit(1);
	}
};

process.on("unhandledRejection", (reason, promise) => {
	logger.error("Unhandled Rejection at:", promise, "reason:", reason);
	// Optionally, you can throw an error here to crash the process
	// throw reason;
});

process.on("uncaughtException", (error) => {
	logger.error("Uncaught Exception:", error);
	// Application specific logging, throwing an error, or other logic here
	process.exit(1);
});

startServer();
