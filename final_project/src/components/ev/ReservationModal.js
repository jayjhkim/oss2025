import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar as CalendarIcon, Zap } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

const timeSlots = [
  "09:00","09:30","10:00","10:30","11:00","11:30",
  "12:00","12:30","13:00","13:30","14:00","14:30",
  "15:00","15:30","16:00","16:30","17:00","17:30",
  "18:00","18:30","19:00","19:30","20:00","20:30"
];

const durations = [
  { value: 30, label: "30분" },
  { value: 60, label: "1시간" },
  { value: 90, label: "1시간 30분" },
  { value: 120, label: "2시간" },
];

export default function ReservationModal({
  station,
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);

  const [selectedTime, setSelectedTime] = useState("");
  const [duration, setDuration] = useState(60);
  const [selectedCharger, setSelectedCharger] = useState(null);
  const [step, setStep] = useState(1);

  const availableChargers =
    station?.chargers?.filter((c) => c.status === "available") || [];

  const handleSubmit = () => {
    const reservationTime = new Date(selectedDate);
    const [h, m] = selectedTime.split(":");
    reservationTime.setHours(parseInt(h), parseInt(m));

    onSubmit({
      station_id: station.id,
      station_name: station.name,
      address: station.address,
      charger_id: selectedCharger?.id || `charger-${Date.now()}`,
      charger_type: selectedCharger?.type || station.chargerType,
      reservation_time: reservationTime.toISOString(),
      duration_minutes: duration,
      status: "active",
    });
  };

  const handleClose = () => {
    setStep(1);
    setSelectedTime("");
    setSelectedCharger(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[999]">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-[500px] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-6">
          <h2 className="text-lg font-semibold text-white">충전기 예약</h2>
          <p className="text-white/80 text-sm mt-1">{station?.name}</p>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {/* STEP 1 */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <p className="font-medium text-slate-700 mb-3">충전기 선택</p>
                  <div className="grid grid-cols-2 gap-3">
                    {availableChargers.map((charger) => (
                      <div
                        key={charger.id}
                        onClick={() => setSelectedCharger(charger)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition ${
                          selectedCharger === charger
                            ? "border-teal-500 bg-teal-50"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Zap
                            className={`w-5 h-5 ${
                              selectedCharger === charger
                                ? "text-teal-600"
                                : "text-slate-400"
                            }`}
                          />
                          <span className="font-medium">{charger.type}</span>
                        </div>
                        <p className="text-xs text-slate-500">
                          {charger.power || "50kW"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  disabled={!selectedCharger}
                  onClick={() => setStep(2)}
                  className={`w-full py-3 rounded-xl text-white font-semibold transition ${
                    selectedCharger
                      ? "bg-gradient-to-r from-teal-500 to-cyan-500"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                >
                  다음
                </button>
              </motion.div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Date */}
                <div>
                  <p className="font-medium text-slate-700 mb-3">날짜 선택</p>

                  <div>
                    <button
                      className="w-full border rounded-lg p-3 flex items-center gap-2"
                      onClick={() => setCalendarOpen(!calendarOpen)}
                    >
                      <CalendarIcon className="w-4 h-4 text-slate-500" />
                      {format(selectedDate, "PPP", { locale: ko })}
                    </button>

                    {/* Custom Calendar */}
                    {calendarOpen && (
                      <div className="mt-2 p-4 border rounded-lg shadow-lg bg-white">
                        <input
                          type="date"
                          value={format(selectedDate, "yyyy-MM-dd")}
                          min={format(new Date(), "yyyy-MM-dd")}
                          onChange={(e) =>
                            setSelectedDate(new Date(e.target.value))
                          }
                          className="w-full border rounded-lg p-2"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Time */}
                <div>
                  <p className="font-medium text-slate-700 mb-3">시간 선택</p>
                  <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                    {timeSlots.map((t) => (
                      <button
                        key={t}
                        onClick={() => setSelectedTime(t)}
                        className={`py-2 rounded-lg text-sm transition ${
                          selectedTime === t
                            ? "bg-teal-500 text-white"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <p className="font-medium text-slate-700 mb-3">충전 시간</p>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full border rounded-lg p-3"
                  >
                    {durations.map((d) => (
                      <option key={d.value} value={d.value}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3">
                  <button
                    className="flex-1 py-3 border rounded-xl font-semibold"
                    onClick={() => setStep(1)}
                  >
                    이전
                  </button>

                  <button
                    disabled={!selectedTime || isSubmitting}
                    onClick={handleSubmit}
                    className={`flex-1 py-3 rounded-xl text-white font-semibold transition ${
                      selectedTime
                        ? "bg-gradient-to-r from-teal-500 to-cyan-500"
                        : "bg-gray-300 cursor-not-allowed"
                    }`}
                  >
                    {isSubmitting ? "예약 중..." : "예약하기"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="mt-4 w-full text-sm text-center text-slate-500 hover:text-slate-700"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
