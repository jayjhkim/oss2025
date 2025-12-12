const R = 6378137;

function webMercatorToLatLng(x, y) {
  const lon = (x / R) * (180 / Math.PI);
  const lat =
    (2 * Math.atan(Math.exp(y / R)) - Math.PI / 2) * (180 / Math.PI);

  return { lat, lng: lon };
}

const CHARGER_TYPE_MAP = {
  "1": "DC차데모",
  "2": "AC완속",
  "3": "DC콤보",
  "4": "급속(통합형)",
  "5": "초급속"
};


//데이터 호출
export async function fetchRealStations() {
  try {
    const response = await fetch("http://localhost:4000/api/charging");
    const json = await response.json();

    const items = json?.response?.body?.items?.item;
    if (!items) return [];

    const grouped = {};

    items.forEach((item) => {
      const id = item.STAT_ID;

      if (!grouped[id]) {
        const x = Number(item.X);
        const y = Number(item.Y);

        if (!x || !y) return;

        const { lat, lng } = webMercatorToLatLng(x, y);

        if (lat < 30 || lat > 45 || lng < 120 || lng > 135) return;

        grouped[id] = {
          id: id,
          name: item.STAT_NM,
          address: item.ADRES,
          company: item.BUSI_NM,
          phone: item.TELNO,
          useTime: item.USE_TM,
          lat,
          lng,
          chargers: []
        };
      }

      grouped[id].chargers.push({
        type: CHARGER_TYPE_MAP[item.CHGER_TY] || "기타"
      });
    });

    const stations = Object.values(grouped).map((st) => {
      const typeCountMap = {};

      st.chargers.forEach((ch) => {
        typeCountMap[ch.type] = (typeCountMap[ch.type] || 0) + 1;
      });

      st.chargers = Object.entries(typeCountMap).map(([type, count]) => ({
        type,
        count
      }));

      return st;
    });
    return stations;
  } catch (err) {
    throw new Error("실제 API 호출 실패");
  }
}

// EvDataService 내보내기
export const EvDataService = {
  async getStations() {
    return await fetchRealStations();
  },

  filterStations(stations, filters) {
    return stations;
  }
};
