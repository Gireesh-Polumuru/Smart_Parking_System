const mongoose = require('mongoose');
const dotenv = require('dotenv');
const ParkingSlot = require('../models/parkingslot');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('✅ Connected to MongoDB');

  const slots = [];

  // 🏍️ Bike Slots (B001–B100)
  for (let i = 1; i <= 100; i++) {
    slots.push({
      slotNumber: `B${i.toString().padStart(3, '0')}`,
      vehicleNumber: '',
      status: 'Empty'
    });
  }

  // 🚗 Car Slots (C001–C100)
  for (let i = 1; i <= 100; i++) {
    slots.push({
      slotNumber: `C${i.toString().padStart(3, '0')}`,
      vehicleNumber: '',
      status: 'Empty'
    });
  }

  // Optional: Clear existing slots before inserting
  await ParkingSlot.deleteMany({});
  await ParkingSlot.insertMany(slots);

  console.log('✅ Successfully inserted 200 slots (B001–B100, C001–C100)');
  mongoose.disconnect();
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
});
