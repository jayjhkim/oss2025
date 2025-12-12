global.fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const express = require("express");
const cors = require("cors");
const xml2js = require("xml2js");

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

const API_KEY = "P0QJKBPH-P0QJ-P0QJ-P0QJ-P0QJKBPHWJ";

app.get("/api/charging", async (req, res) => {
  const url = `https://safemap.go.kr/openApiService/data/getChargingStationData1.do?serviceKey=${API_KEY}&pageNo=1&numOfRows=2000&type=json`;

  try {
    const response = await fetch(url);
    const xml = await response.text();

    xml2js.parseString(xml, { explicitArray: false }, (err, result) => {
      if (err) {
        console.error("XML parsing error:", err);
        return res.status(500).json({ error: "XML parsing failed" });
      }

      return res.json(result);
    });
  } catch (err) {
    console.error("Proxy Error:", err);
    return res.status(500).json({
      error: "Proxy fetch failed",
      detail: err.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
