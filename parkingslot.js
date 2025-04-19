const mongoose = require("mongoose");

const parkingSlotSchema = new mongoose.Schema({
  slotNumber: {
    type: String,
    required: true,
    unique: true,
  },
  vehicleNumber: String,
  status: {
    type: String,
    enum: ["Empty", "Booked", "Confirmed"],
    default: "Empty",
  },
});

module.exports = mongoose.model("ParkingSlot", parkingSlotSchema);
