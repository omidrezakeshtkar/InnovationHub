import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
import Joi from 'joi';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    logger.error(`${err.statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    return res.status(err.statusCode).json({
      message: err.message
    });
  }

  if (err instanceof Joi.ValidationError) {
    logger.error(`400 - Validation Error: ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    return res.status(400).json({
      message: 'Validation Error',
      details: err.details.map(detail => detail.message)
    });
  }

  logger.error(`500 - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  res.status(500).json({
    message: 'An unexpected error occurred'
  });
};