import { Express } from 'express-serve-static-core';
import { IUser } from '../models/User'; // Adjust this import path as necessary

declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}