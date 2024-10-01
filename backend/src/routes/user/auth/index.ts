import { Router } from 'express';
import loginRoute from './login'; // Import the login route
import logoutRoute from './logout'; // Import the logout route
import registerRoute from './register'; // Import the register route
import refreshTokenRoute from './refreshToken'; // Import the refresh token route

// Create a new express router instance
const router = Router();

// Assign routes to the main category router
router.use('/login', loginRoute); // Use the login route
router.use('/logout', logoutRoute); // Use the logout route
router.use('/register', registerRoute); // Use the register route
router.use('/refresh-token', refreshTokenRoute); // Use the refresh token route

// Export the router to be used in other parts of the application
export default router;