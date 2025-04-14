import express from 'express';
import { catchAsync } from '../utils/catchAsync.js';
import { orderCreate,createPaymentIntent ,createReview} from '../controlers/userController.js';  // Corrected the import from 'controlers' to 'controllers'
import {  authUser } from '../controlers/authController.js';  // Corrected import

const router = express.Router();

// Register Route
router.post('/create-order',
    // Run authUser to validate the user token
     authUser,

    // Once the user is authenticated, proceed to order creation
     orderCreate,
);
router.post('/create-payment-intent',
    // Run authUser to validate the user token
    authUser,
    // Once the user is authenticated, proceed to order creation
     createPaymentIntent,
);
router.route('/order/:id/reviews').post(authUser,createReview);
export default router;
