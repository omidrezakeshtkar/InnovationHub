import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { AppError } from './errorHandler';

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(', ');
      return next(new AppError(errorMessage, 400));
    }
    next();
  };
};