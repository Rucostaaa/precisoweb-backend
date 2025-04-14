// models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone:{
      type: String,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    available: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["user", "admin", "driver"], // Restricting roles to valid values
      default: "user", // Default role if none is provided
      required: true,
    },
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    password: {
      type: String,
    },
    status:{
      type: String,
      enum: ["auth", "unAuth",], // Restricting roles to valid values
      default: "auth", // Default role if none is provided
      required: true,
    },
    location: {
      type: {
        type: String, // "Point"
        enum: ["Point"],
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
      },
    },
  },
  { timestamps: true }
);

// Create a 2dsphere index for geospatial queries on the location field
UserSchema.index({ location: "2dsphere" });

export default mongoose.model("User", UserSchema);
