import {
	OpenApiGeneratorV3,
	OpenAPIRegistry,
} from "@asteasolutions/zod-to-openapi";
import { SwaggerOptions } from "swagger-ui-express";
import swaggerUi from "swagger-ui-express";
import { Express, Request, Response } from "express";
import * as schemas from "../schemas";

export const registry = new OpenAPIRegistry();

// Register all schemas
Object.entries(schemas).forEach(([name, schema]) => {
	if (typeof schema === "object" && "shape" in schema) {
		registry.register(name, schema);
	}
});

export const generateOpenApiDocument = () => {
	const generator = new OpenApiGeneratorV3(registry.definitions);

	return generator.generateDocument({
		openapi: "3.0.0",
		info: {
			title: "IdeaExchange API",
			version: "1.0.0",
			description: "API for IdeaExchange platform",
		},
		servers: [
			{
				url: "http://localhost:3000/api", // Update this to your server URL
			},
		],
		security: [
			{
				bearerAuth: [],
			},
		],
	});
};

// Define security scheme separately
registry.registerComponent("securitySchemes", "bearerAuth", {
	type: "http",
	scheme: "bearer",
	bearerFormat: "JWT",
});

export const swaggerUiOptions: SwaggerOptions = {
	swaggerOptions: {
		url: "/api-docs.json",
	},
	customCss: ".swagger-ui .topbar { display: none }",
};

// Function to setup Swagger UI
export const setupSwagger = (app: Express): void => {
	const openApiDocument = generateOpenApiDocument();

	app.use(
		"/api-docs",
		swaggerUi.serve,
		swaggerUi.setup(openApiDocument, {
			swaggerOptions: {
				persistAuthorization: true,
			},
		})
	);

	app.get("/api-docs.json", (req: Request, res: Response) => {
		res.setHeader("Content-Type", "application/json");
		res.send(openApiDocument);
	});
};
