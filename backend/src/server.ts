import app from './app';
import config from './config';
import { connectDatabase } from './database/connection';
import { runMigrations } from './services/migrationService';
import logger from './utils/logger';

const PORT = config.port || 3000;

const startServer = async () => {
  try {
    await connectDatabase();
    await runMigrations();

    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();