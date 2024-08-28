import { MongoClient } from 'mongodb';
import { up, config } from 'migrate-mongo';
import appConfig from '../config';
import path from 'path';
import fs from 'fs';

export const runMigrations = async () => {
  let client: MongoClient | null = null;
  try {
    const configPath = path.resolve(__dirname, '../migrations/migrate-mongo-config.js');
    console.log('Migration config path:', configPath);
    
    if (!fs.existsSync(configPath)) {
      throw new Error(`Migration config file not found at ${configPath}`);
    }

    const migrationConfig = require(configPath);
    console.log('Migration config:', migrationConfig);

    config.set(migrationConfig);

    client = await MongoClient.connect(appConfig.databaseUrl);
    const db = client.db();

    const migrationFiles = fs.readdirSync(path.resolve(__dirname, '../migrations'))
      .filter(file => file.endsWith('.js') && file !== 'migrate-mongo-config.js');

    for (const file of migrationFiles) {
      const migration = require(path.resolve(__dirname, '../migrations', file));
      if (typeof migration.up === 'function') {
        console.log(`Running migration: ${file}`);
        try {
          await migration.up(db, client);
          console.log(`Completed migration: ${file}`);
        } catch (error) {
          console.error(`Error in migration ${file}:`, error);
          // Continue with the next migration instead of stopping the process
        }
      } else {
        console.warn(`Skipping invalid migration file: ${file}`);
      }
    }

    console.log('All migrations completed');
  } catch (error) {
    console.error('Migration process failed:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
  } finally {
    if (client) {
      await client.close();
    }
  }
};