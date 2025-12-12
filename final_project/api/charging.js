import xml2js from "xml2js";

const API_KEY = "P0QJKBPH-P0QJ-P0QJ-P0QJ-P0QJKBPHWJ";

export default async function handler(req, res) {
  const url = `https://safemap.go.kr/openApiService/data/getChargingStationData1.do?serviceKey=${API_KEY}&pageNo=1&numOfRows=2000&type=json`;

  try {
    const response = await fetch(url);
    const text = await response.text();

    try {
      const json = JSON.parse(text);
      return res.status(200).json(json);
    } catch {
    }

    xml2js.parseString(text, { explicitArray: false }, (err, result) => {
      if (err) {
        console.error("❌ XML parsing error:", err);
        return res.status(500).json({ error: "XML parsing failed" });
      }

      return res.status(200).json(result);
    });
  } catch (err) {
    console.error("❌ Proxy Error:", err);
    return res.status(500).json({
      error: "Proxy fetch failed",
      detail: err.message,
    });
  }
}
