import winston from "winston";
// import path from 'path';

const logger = winston.createLogger({
	level: "info",
	format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.errors({ stack: true }),
		winston.format.printf(({ timestamp, level, message, stack }) => {
			const fileInfo = stack ? stack.split("\n")[1].trim() : "";
			return `${timestamp} ${level}: ${message} ${fileInfo}`;
		})
	),
	transports: [
		new winston.transports.Console(),
		new winston.transports.File({ filename: "error.log", level: "error" }),
		new winston.transports.File({ filename: "combined.log" }),
	],
});

export default logger;
