import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5, // Rating between 1 and 5
    },
    comment: {
      type: String,
      default: "",
    },
    target:{
      type: String,
      enum:["motorista","servico"]
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true })
const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    vehicle: {
      brand: { type: String, required: true },
      model: { type: String, required: true },
      plate: { type: String, required: true },
      directions_to_get_costumer:  [
        {
          lat: { type: Number },
          lng: { type: Number },
        },
      ],
      directions:  [
        {
          lat: { type: Number },
          lng: { type: Number },
        },
      ],

    },
    pickup: {
      route: [
        {
          lat: { type: Number },
          lng: { type: Number },
        },
      ],
      address: { type: String },
      location: {
        type: {
          type: String,
          enum: ["Point"],
        },
        coordinates: {
          type: [Number], // [lng, lat]
        },
      },
    },
    destination: {
      route: [
        {
          lat: { type: Number },
          lng: { type: Number },
        },
      ],
      address: { type: String },
      location: {
        type: {
          type: String,
          enum: ["Point"],
        },
        coordinates: {
          type: [Number], // [lng, lat]
        },
      },
    },
    price: {
      type: Number,
      required: true,
    },
    state: {
      type: String,
      enum: ["pending", "accepted", "pickedup", "dropoff", "finalized","paid", "canceled"],
      default: "pending",
    },
    payment_method: {
      type: String,
      enum: ["card", "cash"],
      default: "card",
    },
    card:{
      last4:String,
      payment_method_id:String
    },
    issue: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    reviews:[ReviewSchema]
  },
  { timestamps: true }
);

export default mongoose.model("Order", OrderSchema);
