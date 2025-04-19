document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("bookingForm");
  const carGrid = document.getElementById("carSlotGrid");
  const bikeGrid = document.getElementById("bikeSlotGrid");
  const qrContainer = document.getElementById("qrContainer");

  const BACKEND_URL = "http://localhost:5000"; // Update to your IP if accessing from mobile

  const createSlotDiv = (num, data) => {
    const div = document.createElement("div");
    div.className = "slot";
    div.innerText = num;

    if (data) {
      if (data.status === "Booked") div.classList.add("booked");
      else if (data.status === "Confirmed") div.classList.add("confirmed");
    }

    return div;
  };

  const loadSlots = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/parking/slots`);
      const slots = await res.json();
      carGrid.innerHTML = "";
      bikeGrid.innerHTML = "";

      for (let i = 1; i <= 100; i++) {
        const carNum = "C" + i.toString().padStart(3, "0");
        const bikeNum = "B" + i.toString().padStart(3, "0");

        const carData = slots.find(s => s.slotNumber === carNum);
        const bikeData = slots.find(s => s.slotNumber === bikeNum);

        carGrid.appendChild(createSlotDiv(carNum, carData));
        bikeGrid.appendChild(createSlotDiv(bikeNum, bikeData));
      }
    } catch (err) {
      console.error("Failed to load slots:", err);
    }
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const slotNumber = document.getElementById("slotNumber").value.trim().toUpperCase();
    const vehicleNumber = document.getElementById("vehicleNumber").value.trim();

    try {
      const res = await fetch(`${BACKEND_URL}/parking/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slotNumber, vehicleNumber })
      });

      const data = await res.json();

      if (data.qrData) {
        qrContainer.innerHTML = "";
        new QRCode(qrContainer, {
          text: `${BACKEND_URL}/scan.html?slot=${data.qrData.slot}&vehicle=${data.qrData.vehicle}`,
          width: 200,
          height: 200
        });
      } else {
        alert(data.message || "Booking failed");
      }

      loadSlots();
    } catch (err) {
      console.error("Booking error:", err);
    }
  });

  loadSlots();
});
