const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const FIREBASE_URL = "https://tagps-fa005-default-rtdb.firebaseio.com";
const FIREBASE_TOKEN = "TXTe1aAaT8Rlx17eNBf9gZPQOVOClz8ydGGYA0Rd";

// Kirim data GPS dari alat
app.post("/upload", async (req, res) => {
  const { lat, lon } = req.body;
  if (!lat || !lon) return res.status(400).send("Missing lat/lon");

  try {
    await axios.put(`${FIREBASE_URL}/location/lat.json?auth=${FIREBASE_TOKEN}`, lat);
    await axios.put(`${FIREBASE_URL}/location/lon.json?auth=${FIREBASE_TOKEN}`, lon);
    res.send("Data dikirim ke Firebase");
  } catch (e) {
    console.error(e);
    res.status(500).send("Gagal kirim ke Firebase");
  }
});

// Ambil status kontrol
app.get("/kontrol", async (req, res) => {
  try {
    const { data } = await axios.get(`${FIREBASE_URL}/kontrol_alat.json?auth=${FIREBASE_TOKEN}`);
    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).send("Gagal ambil data kontrol");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server jalan di port ${PORT}`));
