import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { EvDataService } from "../components/ev/EvDataService";
import { MockApiService } from "../components/ev/MockApiService";

import MapMarker from "../components/ev/MapMarker";
import StationCard from "../components/ev/StationCard";
import StationDetailPanel from "../components/ev/StationDetailPanel";
import FilterPanel from "../components/ev/FilterPanel";
import ReservationModal from "../components/ev/ReservationModal";

export default function MapPage() {
  const [stations, setStations] = useState([]);
  const [filteredStations, setFilteredStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);

  const [filters, setFilters] = useState({
    statuses: [],
    chargerTypes: [],
    companies: [],
  });

  const [reservations, setReservations] = useState([]);
  const [showReservationModal, setShowReservationModal] = useState(false);

  const [loading, setLoading] = useState(true);

  // FETCH DATA
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        const data = await EvDataService.getStations();
        const resv = await MockApiService.getReservations();

        console.log("🚀 로딩된 스테이션 개수:", data.length);
        console.log("🧪 첫 스테이션:", data[0]);

        setStations(data);
        setFilteredStations(data);
        setReservations(resv);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  // FILTERING
  useEffect(() => {
    if (!stations || stations.length === 0) return;
    const result = EvDataService.filterStations(stations, filters);
    setFilteredStations(result);
  }, [stations, filters]);

  // CREATE RESERVATION
  const handleMakeReservation = async (payload) => {
    await MockApiService.createReservation(payload);
    const updated = await MockApiService.getReservations();
    setReservations(updated);
  };

  // LOADING
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-slate-500 font-medium">
        로딩 중...
      </div>
    );
  }

  // RENDER
  return (
    <div className="flex w-full h-screen bg-gray-100 overflow-hidden">
      {/* LEFT — FILTER PANEL + LIST */}
      <div className="w-96 h-full overflow-y-auto bg-white border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <FilterPanel filters={filters} onChange={setFilters} />
        </div>

        <div className="divide-y divide-gray-100">
          {filteredStations.map((station) => (
            <div key={station.id} className="p-2">
              <StationCard
                station={station}
                compact={true}
                onSelect={() => setSelectedStation(station)}
                isFavorite={false}
              />
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT — MAP */}
      <div className="flex-1 relative">
        <MapContainer
          center={[37.5665, 126.978]}
          zoom={13}
          style={{ width: "100%", height: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {filteredStations.map((station) => {

            if (
              !station.lat ||
              !station.lng ||
              Number.isNaN(station.lat) ||
              Number.isNaN(station.lng)
            ) {
              return null;
            }

            return (
              <MapMarker
                key={station.id}
                station={{
                  ...station,
                  status: station.status ?? "available",
                }}
                onClick={() => setSelectedStation(station)}
              />
            );
          })}
        </MapContainer>

        {/* DETAIL PANEL */}
        {selectedStation && (
          <StationDetailPanel
            station={selectedStation}
            onClose={() => setSelectedStation(null)}
            onReserve={() => setShowReservationModal(true)}
          />
        )}

        {/* RESERVATION MODAL */}
        {showReservationModal && selectedStation && (
          <ReservationModal
            station={selectedStation}
            onClose={() => setShowReservationModal(false)}
            onSubmit={(form) =>
              handleMakeReservation({
                station_id: selectedStation.id,
                station_name: selectedStation.name,
                charger_type: form.chargerType,
                schedule: form.schedule,
              })
            }
          />
        )}
      </div>
    </div>
  );
}
