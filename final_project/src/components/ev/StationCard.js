import React from 'react';
import { MapPin, Zap, Building2, Heart, Calendar, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

// 👉 card, badge, button 직접 정의 (Tailwind만 사용)
const Card = ({ className = "", children, ...props }) => (
  <div className={`rounded-2xl border border-slate-200 bg-white ${className}`} {...props}>
    {children}
  </div>
);

const Badge = ({ className = "", children }) => (
  <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${className}`}>
    {children}
  </span>
);

const Button = ({ className = "", children, ...props }) => (
  <button
    className={`px-3 py-2 rounded-lg font-medium text-sm transition ${className}`}
    {...props}
  >
    {children}
  </button>
);

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

export default function StationCard({
  station,
  onSelect,
  onFavorite,
  onReserve,
  isFavorite,
  compact = false
}) {
  const status = station.status || 'unknown';

  // ───────────────────────────────────────────────────────────────
  // 🔹 Compact(리스트) 카드
  // ───────────────────────────────────────────────────────────────
  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        className="cursor-pointer"
        onClick={() => onSelect?.(station)}
      >
        <Card className="p-4 hover:shadow-lg transition-all border-0 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${statusColors[status]} animate-pulse`} />
              <div>
                <p className="font-semibold text-slate-800 text-sm line-clamp-1">{station.name}</p>
                <p className="text-xs text-slate-500">{station.company}</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
        </Card>
      </motion.div>
    );
  }

  // ───────────────────────────────────────────────────────────────
  // 🔹 기본 상세 카드
  // ───────────────────────────────────────────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all bg-white">
        <div className="p-5">
          {/* 상단 정보 */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-2.5 h-2.5 rounded-full ${statusColors[status]}`} />
                <span className="text-xs font-medium text-slate-500">{statusLabels[status]}</span>
              </div>
              <h3 className="font-bold text-lg text-slate-800 line-clamp-1">{station.name}</h3>
            </div>

            <button
              className={`rounded-full p-2 transition ${
                isFavorite ? 'text-rose-500' : 'text-slate-300 hover:text-rose-400'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                onFavorite?.(station);
              }}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* 주소/기업/타입 */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-slate-600">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span className="text-sm line-clamp-1">{station.address}</span>
            </div>

            <div className="flex items-center gap-2 text-slate-600">
              <Building2 className="w-4 h-4 text-slate-400" />
              <span className="text-sm">{station.company}</span>
            </div>

            <div className="flex items-center gap-2 text-slate-600">
              <Zap className="w-4 h-4 text-slate-400" />
              <span className="text-sm">{station.charger_type}</span>
            </div>
          </div>

          {/* 충전기 목록 */}
          <div className="flex items-center gap-2 flex-wrap mb-4">
            {station.chargers?.map((c, i) => (
              <Badge
                key={i}
                className={
                  c.status === 'available'
                    ? 'bg-emerald-100 text-emerald-700'
                    : c.status === 'charging'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-slate-100 text-slate-600'
                }
              >
                {c.type}
              </Badge>
            ))}
          </div>

          {/* 버튼 */}
          <div className="flex gap-2">
            <Button
              className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white"
              onClick={() => onSelect?.(station)}
            >
              상세 보기
            </Button>

            {status === 'available' && (
              <Button
                className="border border-teal-200 text-teal-600 hover:bg-teal-50"
                onClick={(e) => {
                  e.stopPropagation();
                  onReserve?.(station);
                }}
              >
                <Calendar className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
