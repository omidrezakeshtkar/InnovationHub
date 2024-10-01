import express from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from 'swagger-jsdoc';
import { swaggerUiOptions } from "./config/swagger";  // Remove swaggerSpec from this import
import routes from "./routes";
import { errorHandler } from "./middleware/errorHandler";
import { apiLimiter } from "./middleware/rateLimiter";
import path from "path";
import config from "./config";
import logger from "./utils/logger";

const app = express();

// CORS configuration
const corsOptions = {
	origin: [
		"http://localhost:4000", // Allow your frontend origin
		"http://localhost:3000"  // Allow your backend origin (if needed)
	],
	optionsSuccessStatus: 200,
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Use helmet with adjusted settings for development
if (config.nodeEnv === "development") {
	app.use(
		helmet({
			contentSecurityPolicy: false,
		})
	);
} else {
	app.use(helmet());
}

app.use(express.json());

// Apply rate limiting to all routes
app.use(apiLimiter);

// Swagger configuration
const swaggerOptions = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'IdeaExchange API',
			version: '1.0.0',
			description: 'API for IdeaExchange platform',
		},
		servers: [
			{
				url: 'http://localhost:3000/api', // Update this to your server URL
			},
		],
		components: {
			securitySchemes: {
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT',
				},
			},
			schemas: {
				User: {
					type: 'object',
					properties: {
						id: { type: 'string' },
						name: { type: 'string' },
						email: { type: 'string' },
						role: { 
							type: 'string',
							enum: ['user', 'moderator', 'admin', 'department_head']
						},
						department: { type: 'string' },
						createdAt: { type: 'string', format: 'date-time' },
						updatedAt: { type: 'string', format: 'date-time' },
					},
				},
				UpdateUserProfile: {
					type: 'object',
					properties: {
						name: { type: 'string' },
						email: { type: 'string' },
					},
				},
			},
		},
		security: [{
			bearerAuth: [],
		}],
	},
	apis: ['./src/routes/**/*.ts'], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Serve Swagger specification as JSON
app.get("/api-docs.json", (req, res) => {
	res.setHeader("Content-Type", "application/json");
	res.send(swaggerSpec);
});

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

// Apply routes
app.use("/api", routes);

// Error handling middleware
app.use(errorHandler);

logger.info("Express application setup complete.");

export default app;
