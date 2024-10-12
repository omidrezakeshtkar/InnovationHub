const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

module.exports = {
	mongodb: {
		url: process.env.DATABASE_URL || "mongodb://localhost:27017/InnovationHub",
		options: {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		},
	},
	migrationsDir: path.resolve(__dirname, "./"),
	changelogCollectionName: "changelog",
	migrationFileExtension: ".js",
	useFileHash: false,
	moduleSystem: "commonjs",
};
