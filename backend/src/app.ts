import express from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { generateOpenApiDocument, swaggerUiOptions } from "./config/swagger";
import routes from "./routes";
import { errorHandler } from "./middleware/errorHandler";
import config from "./config";
import logger from "./utils/logger";

const app = express();

// CORS configuration
const corsOptions = {
	origin: [
		"http://localhost:4000", // Allow your frontend origin
		"http://localhost:3000", // Allow your backend origin (if needed)
		"http://localhost:5173",
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

// Generate OpenAPI document
const openApiDocument = generateOpenApiDocument();

// Serve Swagger specification as JSON
app.get("/api-docs.json", (req, res) => {
	res.setHeader("Content-Type", "application/json");
	res.send(openApiDocument);
});

// Serve Swagger UI
app.use(
	"/api-docs",
	swaggerUi.serve,
	swaggerUi.setup(openApiDocument, swaggerUiOptions)
);

// Apply routes
app.use("/api", routes);

// Error handling middleware
app.use(errorHandler);

logger.info("Express application setup complete.");

export default app;
