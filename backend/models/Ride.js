const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema(
  {
    passenger: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    pickupLocation: {
      address: { type: String, required: true },
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    dropoffLocation: {
      address: { type: String, required: true },
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    fare: { type: Number, required: true },
    distance: { type: Number, required: true },
    status: {
      type: String,
      enum: ["requested", "accepted", "ongoing", "completed", "cancelled"],
      default: "requested",
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "online"],
      default: "cash",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
    rideType: {
      type: String,
      enum: ["bike", "auto", "car"],
      default: "car",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ride", rideSchema);
