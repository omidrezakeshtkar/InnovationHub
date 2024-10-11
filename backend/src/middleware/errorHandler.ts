import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../utils/CustomError';
import logger from '../utils/logger';

export class AppError extends CustomError {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  let statusCode = 500;
  let errorMessage = 'Internal Server Error';

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    errorMessage = err.message;
  } else if (err instanceof CustomError) {
    statusCode = 400;
    errorMessage = err.message;
  }

  // Log the error with stack trace
  logger.error(`${err.name}: ${err.message}\n${err.stack}`);

  // In development, send the error details including the stack trace
  if (process.env.NODE_ENV === 'development') {
    return res.status(statusCode).json({
      error: {
        message: errorMessage,
        stack: err.stack,
      },
    });
  }

  // In production, send a generic error message
  res.status(statusCode).json({ error: errorMessage });
};