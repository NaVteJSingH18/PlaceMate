import express from 'express';
import { 
    loginUser, 
    registerUser, 
    changePassword, 
    deleteAccount, 
    forgotPassword, 
    resetPassword 
} from '../controllers/authController.js';
import validationMiddleware from '../middleware/validationMiddleware.js'
import { validateRegister, validateLogin } from '../validators/userValidator.js'
import protect from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/register',validateRegister,validationMiddleware, registerUser);
router.post('/login',validateLogin,validationMiddleware, loginUser);
router.put('/change-password', protect, changePassword);
router.delete('/account', protect, deleteAccount);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resetToken', resetPassword);

export default router;