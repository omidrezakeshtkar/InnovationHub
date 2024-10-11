import {
	OpenApiGeneratorV3,
	OpenAPIRegistry,
} from "@asteasolutions/zod-to-openapi";
import { SwaggerOptions } from "swagger-ui-express";
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

export const swaggerUiOptions: SwaggerOptions = {
	swaggerOptions: {
		url: "/api-docs.json",
	},
	customCss: ".swagger-ui .topbar { display: none }",
};

// Function to setup Swagger UI
export const setupSwagger = (app: any) => {
	const swaggerUi = require("swagger-ui-express");
	const openApiDocument = generateOpenApiDocument();

	app.use(
		"/api-docs",
		swaggerUi.serve,
		swaggerUi.setup(openApiDocument, swaggerUiOptions)
	);
	app.get("/api-docs.json", (req: any, res: any) => {
		res.setHeader("Content-Type", "application/json");
		res.send(openApiDocument);
	});
};
