import express from 'express';
import { loginUser, registerUser } from '../controllers/authController.js';
import validationMiddleware from '../middleware/validationMiddleware.js'
import validateRegister from '../middleware/validators/userValidator.js'
const router = express.Router();

router.post('/register',validateRegister,validationMiddleware, registerUser);
router.post('/login', loginUser);

export default router;