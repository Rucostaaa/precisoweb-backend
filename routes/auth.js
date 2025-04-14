import express from 'express';
import { catchAsync } from '../utils/catchAsync.js';
import { getUser, userLogin, userLogout, userRegister,createTokenUser } from '../controlers/authController.js';  // Corrected 'controlers' to 'controllers'

const router = express.Router();

// Register Route
router.post('/register', catchAsync(userRegister));

// Login Route
router.post('/login', catchAsync(userLogin));
router.post('/create-token-user', catchAsync(createTokenUser));

// Protected Route (Get User Data)
router.get('/user', catchAsync(getUser));

// Logout Route (to invalidate token)
router.post('/logout', catchAsync(userLogout));

export default router;
