const express = require("express"); 
const router = express.Router();
const ParkingSlot = require("../models/parkingslot");

// Get all slots
router.get("/slots", async (req, res) => {
  try {
    const slots = await ParkingSlot.find();
    res.json(slots);
  } catch (err) {
    res.status(500).json({ message: "Error fetching slots" });
  }
});

// Book a slot
router.post("/book", async (req, res) => {
  const { slotNumber, vehicleNumber } = req.body;

  try {
    const slot = await ParkingSlot.findOne({ slotNumber });

    if (!slot) return res.status(404).json({ message: "Slot not found" });
    if (slot.status !== "Empty") return res.status(400).json({ message: "Slot not available" });

    slot.status = "Booked";
    slot.vehicleNumber = vehicleNumber;
    await slot.save();

    const qrData = {
      slot: slotNumber,
      vehicle: vehicleNumber,
    };

    res.json({ message: "Slot booked", qrData });
  } catch (err) {
    res.status(500).json({ message: "Booking failed" });
  }
});

// Confirm entry
router.post("/entry", async (req, res) => {
  const { slot } = req.body;

  try {
    const s = await ParkingSlot.findOne({ slotNumber: slot });
    if (!s || s.status !== "Booked") {
      return res.status(400).json({ message: "Slot not eligible for entry" });
    }

    s.status = "Confirmed";
    await s.save();
    res.json({ message: "Entry confirmed" });
  } catch (err) {
    res.status(500).json({ message: "Entry confirmation failed" });
  }
});

// Confirm exit
router.post("/exit", async (req, res) => {
  const { slot } = req.body;

  try {
    const s = await ParkingSlot.findOne({ slotNumber: slot });
    if (!s || s.status !== "Confirmed") {
      return res.status(400).json({ message: "Slot not eligible for exit" });
    }

    s.status = "Empty";
    s.vehicleNumber = "";
    await s.save();
    res.json({ message: "Exit confirmed, slot is now available" });
  } catch (err) {
    res.status(500).json({ message: "Exit confirmation failed" });
  }
});

module.exports = router;
