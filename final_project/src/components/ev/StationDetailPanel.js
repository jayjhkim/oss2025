import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, MapPin, Building2, Clock, Phone,
  Heart, Calendar, Navigation, Plus, Tag
} from 'lucide-react';

const statusColors = {
  available: 'bg-emerald-500',
  charging: 'bg-amber-500',
  offline: 'bg-red-500',
  unknown: 'bg-gray-400'
};

const statusLabels = {
  available: '사용 가능',
  charging: '사용 중',
  offline: '오프라인',
  unknown: '상태 불명'
};

export default function StationDetailPanel({ 
  station, 
  onClose, 
  onFavorite, 
  onReserve,
  isFavorite,
  favoriteData
}) {
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [note, setNote] = useState(favoriteData?.notes || '');
  const [newTag, setNewTag] = useState('');
  const [tags, setTags] = useState(favoriteData?.tags || []);

  if (!station) return null;

  const status = station.status || 'unknown';

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleSaveFavorite = () => {
    onFavorite?.(station, { notes: note, tags });
    setShowNoteInput(false);
  };

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      <AnimatePresence>
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className="absolute right-0 top-0 h-full w-full md:w-[420px] bg-white shadow-2xl overflow-y-auto pointer-events-auto"
        >
          {/* HEADER */}
          <div className="relative h-48 bg-gradient-to-br from-teal-400 to-cyan-500">
            <div className="absolute inset-0 bg-black/20" />

            <button
              className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 text-white rounded-full"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="absolute bottom-4 left-6">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-3 h-3 rounded-full ${statusColors[status]} animate-pulse`} />
                <span className="text-white/90 text-sm font-medium">
                  {statusLabels[status]}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white">{station.name}</h2>
            </div>
          </div>

          {/* CONTENT */}
          <div className="p-6 space-y-6">

            {/* Quick Buttons */}
            <div className="flex gap-3">
              <button
                className={`flex-1 py-2.5 rounded-xl text-white font-medium ${
                  isFavorite ? "bg-rose-500" : "bg-slate-800"
                }`}
                onClick={() =>
                  isFavorite ? setShowNoteInput(!showNoteInput) : handleSaveFavorite()
                }
              >
                <Heart className="w-4 h-4 inline mr-2" />
                {isFavorite ? "즐겨찾기 편집" : "즐겨찾기"}
              </button>

              <button
                className="flex-1 py-2.5 rounded-xl text-white font-medium bg-gradient-to-r from-teal-500 to-cyan-500"
                onClick={() => onReserve?.(station)}
              >
                <Calendar className="w-4 h-4 inline mr-2" /> 예약하기
              </button>
            </div>

            {/* NOTE Box */}
            {showNoteInput && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3 bg-slate-50 p-4 rounded-xl"
              >
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="메모를 입력하세요..."
                  className="w-full h-24 p-3 border rounded-md resize-none"
                />
                <div className="flex gap-2">
                  <input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="태그 추가"
                    className="flex-1 px-3 py-2 border rounded-md"
                  />
                  <button className="p-2 border rounded-md" onClick={handleAddTag}>
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, i) => (
                      <span
                        key={i}
                        className="flex items-center gap-1 bg-teal-100 text-teal-700 px-2 py-1 rounded-md text-sm cursor-pointer"
                        onClick={() => setTags(tags.filter((_, idx) => idx !== i))}
                      >
                        <Tag className="w-3 h-3" /> {tag} ×
                      </span>
                    ))}
                  </div>
                )}

                <button
                  className="w-full py-2 bg-teal-500 text-white rounded-xl"
                  onClick={handleSaveFavorite}
                >
                  저장하기
                </button>
              </motion.div>
            )}

            {/* ADDRESS */}
            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
              <MapPin className="w-5 h-5 text-teal-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">{station.address}</p>
                <p className="text-xs text-slate-500">{station.detailAddress}</p>
              </div>
            </div>

            {/* SUMMARY */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <Building2 className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">운영사</p>
                  <p className="text-sm font-medium">{station.company}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <Clock className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">운영시간</p>
                  <p className="text-sm font-medium">{station.useTime || "24시간"}</p>
                </div>
              </div>
            </div>

            {/* 고객센터 */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <Phone className="w-5 h-5 text-slate-400" />

              <div className="flex items-center gap-2 p-1">
                <p className="text-xs text-slate-500">고객센터</p>
                <p className="text-sm font-medium">
                  {station.phone || "정보 없음"}
                </p>
              </div>
            </div>


            {/* CHARGER TYPE SUMMARY */}
            <div>
              <h3 className="font-semibold mb-3">충전기 타입</h3>
              <div className="space-y-2">
                {station.chargers.map((c, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-xl"
                  >
                    <span className="font-medium">{c.type}</span>
                    <span className="text-sm text-slate-600">{c.count}대</span>
                  </div>
                ))}
              </div>
            </div>

            {/* KAKAO MAP LINK */}
            <button
              className="w-full py-2 border border-teal-300 text-teal-600 rounded-xl flex items-center justify-center"
              onClick={() =>
                window.open(
                  `https://map.kakao.com/link/to/${station.name},${station.lat},${station.lng}`,
                  "_blank"
                )
              }
            >
              <Navigation className="w-4 h-4 mr-2" /> 길찾기
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
