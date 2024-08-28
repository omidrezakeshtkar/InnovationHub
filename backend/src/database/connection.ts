import mongoose from 'mongoose';
import config from '../config';

const MAX_RETRIES = 5;
const RETRY_INTERVAL = 5000; // 5 seconds

export const connectDatabase = async (retryCount = 0) => {
  try {
    console.log('Attempting to connect to database...');
    mongoose.set('strictQuery', true);
    await mongoose.connect(config.databaseUrl);
    console.log('Connected to database');
  } catch (error) {
    console.error('Database connection error:', error);
    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying in ${RETRY_INTERVAL / 1000} seconds...`);
      setTimeout(() => connectDatabase(retryCount + 1), RETRY_INTERVAL);
    } else {
      console.error('Max retries reached. Exiting...');
      process.exit(1);
    }
  }
};