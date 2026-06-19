const socketHandler = (io) => {
  // Store active drivers and their locations
  const activeDrivers = {};

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Driver goes online and shares location
    socket.on("driver:online", ({ driverId, location }) => {
      activeDrivers[driverId] = {
        socketId: socket.id,
        location,
        driverId,
      };
      console.log(`Driver ${driverId} is online`);
      // Broadcast updated driver list to all passengers
      io.emit("drivers:updated", Object.values(activeDrivers));
    });

    // Driver updates their location
    socket.on("driver:location", ({ driverId, location }) => {
      if (activeDrivers[driverId]) {
        activeDrivers[driverId].location = location;
        // Broadcast to all clients tracking this driver
        io.emit("driver:locationUpdate", { driverId, location });
      }
    });

    // Passenger requests a ride
    socket.on("ride:request", (rideData) => {
      console.log("Ride requested:", rideData._id);
      // Broadcast to all online drivers
      io.emit("ride:newRequest", rideData);
    });

    // Driver accepts a ride
    socket.on("ride:accept", ({ rideId, driverId }) => {
      console.log(`Driver ${driverId} accepted ride ${rideId}`);
      io.emit("ride:accepted", { rideId, driverId });
    });

    // Driver completes a ride
    socket.on("ride:complete", ({ rideId }) => {
      console.log(`Ride ${rideId} completed`);
      io.emit("ride:completed", { rideId });
    });

    // Ride cancelled
    socket.on("ride:cancel", ({ rideId }) => {
      console.log(`Ride ${rideId} cancelled`);
      io.emit("ride:cancelled", { rideId });
    });

    // Driver goes offline
    socket.on("driver:offline", ({ driverId }) => {
      delete activeDrivers[driverId];
      console.log(`Driver ${driverId} went offline`);
      io.emit("drivers:updated", Object.values(activeDrivers));
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      // Remove driver from active list if they disconnect
      for (const driverId in activeDrivers) {
        if (activeDrivers[driverId].socketId === socket.id) {
          delete activeDrivers[driverId];
          io.emit("drivers:updated", Object.values(activeDrivers));
          console.log(`Driver ${driverId} disconnected`);
          break;
        }
      }
      console.log("User disconnected:", socket.id);
    });
  });
};

module.exports = socketHandler;
