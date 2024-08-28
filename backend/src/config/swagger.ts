import swaggerJsdoc from "swagger-jsdoc";
import { SwaggerOptions } from "swagger-ui-express";
import path from "path";
import config from "./index";

const options: swaggerJsdoc.Options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "IdeaExchange API",
			version: "1.0.0",
			description: "API documentation for the IdeaExchange platform",
		},
		servers: [
			{
				url: `${config.websiteUrl}/api`,
				description:
					config.nodeEnv === "development"
						? "Development server"
						: "Production server",
			},
		],
	},
	apis: [
		path.resolve(__dirname, "../routes/**/*.ts"),
		path.resolve(__dirname, "../models/*.ts"),
	],
};

console.log("Generating Swagger specification...");
export const swaggerSpec = swaggerJsdoc(options);
console.log("Swagger specification generated successfully.");
console.log("Swagger spec:", JSON.stringify(swaggerSpec, null, 2));

export const swaggerUiOptions: SwaggerOptions = {
	explorer: true,
	swaggerOptions: {
		url: "/api-docs.json",
	},
	customCss: ".swagger-ui .topbar { display: none }",
};
console.log("Swagger UI options set.");

const swaggerOptions = {
	swaggerDefinition: {
		openapi: "3.0.0",
		info: {
			title: "API Documentation",
			version: "1.0.0",
		},
		servers: [
			{
				url: "http://localhost:3000/api",
			},
		],
		components: {
			securitySchemes: {
				bearerAuth: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT",
				},
			},
		},
	},
	apis: ["./src/routes/**/*.ts"], // Ensure this path is correct
};
