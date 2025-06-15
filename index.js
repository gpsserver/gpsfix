const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const FIREBASE_URL = "https://tagps-fa005-default-rtdb.firebaseio.com";

// Terima data GPS dan simpan ke Firebase
app.post("/upload", async (req, res) => {
  const { lat, lon } = req.body;
  if (!lat || !lon) {
    return res.status(400).send("Latitude dan Longitude diperlukan");
  }

  try {
    await axios.put(`${FIREBASE_URL}/location/lat.json`, lat);
    await axios.put(`${FIREBASE_URL}/location/lon.json`, lon);
    res.send("Data lokasi berhasil dikirim ke Firebase");
  } catch (error) {
    console.error(error);
    res.status(500).send("Gagal kirim data ke Firebase");
  }
});

// Kirim status kontrol (relay dan buzzer)
app.get("/kontrol", async (req, res) => {
  try {
    const relayRes = await axios.get(`${FIREBASE_URL}/kontrol_alat/relay.json`);
    const buzzerRes = await axios.get(`${FIREBASE_URL}/kontrol_alat/buzzer.json`);

    res.json({
      relay: relayRes.data,
      buzzer: buzzerRes.data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Gagal ambil data kontrol dari Firebase");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});
