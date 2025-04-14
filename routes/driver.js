import express from 'express';
import { catchAsync } from '../utils/catchAsync.js';
import { getSingleOrder, toogleAvailability, updateOrder,updateRoute,updateLocation } from '../controlers/driverController.js';  // Corrected the import from 'controlers' to 'controllers'
import { authUser } from '../controlers/authController.js';


const router = express.Router();

// Register Route
router.get('/toogle-availability',
    // Run authUser to validate the user token
     authUser,

    // Once the user is authenticated, proceed to order creation
     toogleAvailability,
);
router.route('/order/:id').get(authUser,getSingleOrder).patch(updateOrder)
router.patch('/order/:id/update-route',authUser,updateRoute)
router.patch('/update-location',authUser,updateLocation)





export default router;
