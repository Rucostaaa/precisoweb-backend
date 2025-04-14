import Order from "../models/OrderModel.js"; // Ensure the correct path to your Order model
import { validationResult } from "express-validator"; // Optional for input validation
import Stripe from 'stripe';
import User from "../models/UserModel.js";
import mongoose from "mongoose";
import { catchAsync } from "../utils/catchAsync.js";
export const orderCreate = async (req, res) => {
  // Validate input (optional, but useful for better error handling)
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Fetch the user (Make sure to await it)
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Extract vehicle, transport, and category information from the request body
    const { vehicle, transport,phone } = req.body.user;

    console.log("req.body", req.body);

    if (!vehicle || !transport) {
      return res.status(400).json({ message: "Missing required fields: vehicle or transport" });
    }

    const { brand, model, plate,directions} = vehicle;
    const driverId = new mongoose.Types.ObjectId("67e7fdab60618de02b371a7e");

    // Create a new order
    const newOrder = new Order({
      user: req.user._id,  // Assuming the user is authenticated
      phone:phone,
      driver:driverId,
      vehicle: {
        brand,
        model,
        plate,
        directions,
      },
      pickup: {
        address: vehicle.pickUp.address,
        location: {coordinates:vehicle.pickUp.coordinates}
      },
      destination: {
        address: vehicle.destination.address,
        location: {coordinates:vehicle.destination.coordinates}

      },
      price: transport.preco,
      issue: vehicle.category,
      state: "pending",  // Default state is "pending"
    });

    // Save the order and associate it with the user
    const savedOrder = await newOrder.save();
    console.log("savedOrder", savedOrder);

    // Add the saved order to the user's order array
    user.orders.push(savedOrder);
    await user.save();

    // Return the created order as the response
    return res.status(201).json({ order: savedOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({ message: error.message });
  }
};



export const createPaymentIntent = async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // Securely store this in your env file
  console.log(process.env.STRIPE_SECRET_KEY)
console.log(req.body);

  try {
    const { amount, currency = 'eur', paymentMethodType = 'card' } = req.body;

    if (!amount || isNaN(amount)) {
      return res.status(400).json({ error: 'Invalid amount' });
    }
    console.log("req.body",req.body);
    
    // Stripe expects amount in the smallest currency unit (e.g., cents for EUR/USD)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      payment_method_types: [paymentMethodType],
    });
    console.log("paymentIntent",paymentIntent);
    
    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating PaymentIntent:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
export const createReview = catchAsync(async (req, res) => {
  const { rating, comment, target } = req.body; // Destructure review data from the request body
  const { id } = req.params; // Get the order ID from the URL

  // Validate the target value ('motorista' or 'servico')
  if (!["motorista", "servico"].includes(target)) {
    return res.status(400).json({ message: "Invalid target. Must be 'motorista' or 'servico'." });
  }

  // Find the order by ID
  const order = await Order.findById(id);
  
  // If the order is not found, return an error
  if (!order) {
    return res.status(404).json({ message: "Order not found." });
  }

  // Create the review object
  const review = {
    userId: req.user._id, // The user ID will be taken from the authenticated user
    rating,
    comment,
    target,
  };

  // Add the review to the order's reviews array
  order.reviews.push(review);

  // Save the updated order with the new review
  await order.save();

  // Send a success response
  res.status(200).json({
    message: "Review added successfully.",
    review,
  });
});
