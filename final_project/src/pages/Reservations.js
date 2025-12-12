import React, { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Zap,
  X as XIcon,
  CheckCircle,
  AlertCircle,
  Timer,
  Trash2,
} from "lucide-react";
import { format, addMinutes, isPast } from "date-fns";
import { ko } from "date-fns/locale";

const API_URL = "https://6936218cfa8e704dafbfb8ac.mockapi.io/favorites";

export default function ReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [activeTab, setActiveTab] = useState("active");
  const [cancelModal, setCancelModal] = useState(null);

  // -------------------------------
  // Fetch Data
  // -------------------------------
  const loadReservations = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setReservations(data);
  };

  const cancelReservation = async (id) => {
    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "cancelled" }),
    });
    setCancelModal(null);
    loadReservations();
  };

  const deleteReservation = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    loadReservations();
  };

  useEffect(() => {
    loadReservations();
  }, []);

  // -------------------------------
  // Helpers
  // -------------------------------
  const filtered = reservations.filter((r) => r.status === activeTab);

  const getEndTime = (reservation) => {
    const start = new Date(reservation.reservation_time);
    return addMinutes(start, reservation.duration_minutes || 60);
  };

  const isExpired = (reservation) => {
    return isPast(getEndTime(reservation));
  };

  const statusUI = {
    active: {
      label: "예약됨",
      color: "bg-teal-100 text-teal-700",
      icon: Timer,
    },
    completed: {
      label: "완료",
      color: "bg-slate-100 text-slate-600",
      icon: CheckCircle,
    },
    cancelled: {
      label: "취소됨",
      color: "bg-red-100 text-red-700",
      icon: XIcon,
    },
  };

  // -------------------------------
  // UI
  // -------------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">예약 관리</h1>
              <p className="text-sm text-slate-500">충전기 예약 현황</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="grid grid-cols-3 bg-slate-100 rounded-xl overflow-hidden">
            {["active", "completed", "cancelled"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 text-center font-medium ${
                  activeTab === tab
                    ? "bg-white text-slate-900 shadow"
                    : "text-slate-500"
                }`}
              >
                {statusUI[tab].label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">
              예약이 없습니다
            </h3>
          </div>
        ) : (
          filtered.map((reservation) => {
            const startTime = new Date(reservation.reservation_time);
            const endTime = getEndTime(reservation);
            const expired = isExpired(reservation);
            const cfg = statusUI[reservation.status];
            const Icon = cfg.icon;

            return (
              <div
                key={reservation.id}
                className={`bg-white rounded-2xl shadow overflow-hidden transform transition-all border
                  ${expired && reservation.status === "active" ? "border-amber-400" : "border-transparent"}
                `}
              >
                {/* expired banner */}
                {expired && reservation.status === "active" && (
                  <div className="bg-amber-50 px-6 py-2 flex items-center gap-2 text-amber-700 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>예약 시간이 지났습니다</span>
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.color}`}
                      >
                        <Icon className="w-3 h-3" />
                        {cfg.label}
                      </span>

                      <h3 className="text-lg font-bold text-slate-800 mt-2">
                        {reservation.station_name}
                      </h3>

                      <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                        <MapPin className="w-4 h-4" />
                        <span>{reservation.address}</span>
                      </div>
                    </div>

                    {/* buttons */}
                    {reservation.status === "active" ? (
                      <button
                        onClick={() => setCancelModal(reservation)}
                        className="text-slate-400 hover:text-red-600"
                      >
                        <XIcon className="w-5 h-5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => deleteReservation(reservation.id)}
                        className="text-slate-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* date & time */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-slate-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                        <Calendar className="w-4 h-4" />
                        예약 날짜
                      </div>
                      <p className="font-semibold text-slate-800">
                        {format(startTime, "PPP", { locale: ko })}
                      </p>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                        <Clock className="w-4 h-4" />
                        예약 시간
                      </div>
                      <p className="font-semibold text-slate-800">
                        {format(startTime, "HH:mm")} - {format(endTime, "HH:mm")}
                      </p>
                    </div>
                  </div>

                  {/* charger info */}
                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-slate-400" />
                      {reservation.charger_type}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Timer className="w-4 h-4 text-slate-400" />
                      {reservation.duration_minutes}분
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* -------------------------------
           Cancel Modal
      ------------------------------- */}
      {cancelModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-40">
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-2">예약 취소</h2>
            <p className="text-slate-600 mb-4">정말 예약을 취소하시겠습니까?</p>

            <div className="bg-slate-50 rounded-xl p-4 mb-6">
              <p className="font-semibold text-slate-800">
                {cancelModal.station_name}
              </p>
              <p className="text-sm text-slate-500">
                {format(new Date(cancelModal.reservation_time), "PPP p", {
                  locale: ko,
                })}
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded-lg bg-slate-200"
                onClick={() => setCancelModal(null)}
              >
                돌아가기
              </button>

              <button
                className="px-4 py-2 rounded-lg bg-red-600 text-white"
                onClick={() => cancelReservation(cancelModal.id)}
              >
                예약 취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
