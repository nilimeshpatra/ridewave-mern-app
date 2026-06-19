const Ride = require("../models/Ride");

// Calculate fare based on distance and ride type
const calculateFare = (distance, rideType) => {
  const rates = { bike: 8, auto: 12, car: 18 };
  const baseFare = { bike: 20, auto: 30, car: 50 };
  const rate = rates[rideType] || rates.car;
  const base = baseFare[rideType] || baseFare.car;
  return Math.round(base + rate * distance);
};

// @POST /api/rides/book
const bookRide = async (req, res) => {
  try {
    const { pickupLocation, dropoffLocation, rideType, paymentMethod, distance } = req.body;
    const fare = calculateFare(distance, rideType);
    const ride = await Ride.create({
      passenger: req.user._id,
      pickupLocation,
      dropoffLocation,
      rideType,
      paymentMethod,
      distance,
      fare,
    });
    res.status(201).json(ride);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/rides/my-rides
const getMyRides = async (req, res) => {
  try {
    const rides = await Ride.find({ passenger: req.user._id })
      .populate("driver", "name phone")
      .sort({ createdAt: -1 });
    res.json(rides);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/rides/:id
const getRideById = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id)
      .populate("passenger", "name phone")
      .populate("driver", "name phone");
    if (!ride) return res.status(404).json({ message: "Ride not found" });
    res.json(ride);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @PUT /api/rides/:id/cancel
const cancelRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ message: "Ride not found" });
    if (ride.status !== "requested")
      return res.status(400).json({ message: "Cannot cancel this ride" });
    ride.status = "cancelled";
    await ride.save();
    res.json(ride);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/rides/available (for drivers)
const getAvailableRides = async (req, res) => {
  try {
    const rides = await Ride.find({ status: "requested" })
      .populate("passenger", "name phone")
      .sort({ createdAt: -1 });
    res.json(rides);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @PUT /api/rides/:id/accept (for drivers)
const acceptRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ message: "Ride not found" });
    if (ride.status !== "requested")
      return res.status(400).json({ message: "Ride no longer available" });
    ride.driver = req.user._id;
    ride.status = "accepted";
    await ride.save();
    res.json(ride);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @PUT /api/rides/:id/complete (for drivers)
const completeRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ message: "Ride not found" });
    if (ride.status !== "accepted" && ride.status !== "ongoing")
      return res.status(400).json({ message: "Cannot complete this ride" });
    ride.status = "completed";
    ride.paymentStatus = "paid";
    await ride.save();
    res.json(ride);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { bookRide, getMyRides, getRideById, cancelRide, getAvailableRides, acceptRide, completeRide };
