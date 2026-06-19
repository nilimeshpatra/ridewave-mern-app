const express = require("express");
const router = express.Router();
const {
  bookRide,
  getMyRides,
  getRideById,
  cancelRide,
  getAvailableRides,
  acceptRide,
  completeRide,
} = require("../controllers/rideController");
const { protect } = require("../middleware/authMiddleware");

router.post("/book", protect, bookRide);
router.get("/my-rides", protect, getMyRides);
router.get("/available", protect, getAvailableRides);
router.get("/:id", protect, getRideById);
router.put("/:id/cancel", protect, cancelRide);
router.put("/:id/accept", protect, acceptRide);
router.put("/:id/complete", protect, completeRide);

module.exports = router;
