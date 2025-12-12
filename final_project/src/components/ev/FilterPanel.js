import React from "react";
import { motion } from "framer-motion";
import { 
  Filter, X, Zap, Building2, CheckCircle, 
  MapPin, RotateCcw
} from "lucide-react";

const chargerTypes = ["DC 차데모", "DC 콤보", "AC 완속", "AC 3상"];

const statuses = [
  { value: "available", label: "사용 가능", color: "bg-emerald-100 text-emerald-700" },
  { value: "charging", label: "사용 중", color: "bg-amber-100 text-amber-700" },
  { value: "offline", label: "오프라인", color: "bg-red-100 text-red-700" }
];

const companies = [
  "한국전력", "환경부", "SK", "GS칼텍스", "CJ", "차지비", "EVAR", "파워큐브"
];

export default function FilterPanel({ filters, onFilterChange, onClose, isOpen }) {
  const handleTypeToggle = (type) => {
    const newTypes = filters.chargerTypes.includes(type)
      ? filters.chargerTypes.filter((t) => t !== type)
      : [...filters.chargerTypes, type];
    onFilterChange({ ...filters, chargerTypes: newTypes });
  };

  const handleStatusToggle = (status) => {
    const newStatuses = filters.statuses.includes(status)
      ? filters.statuses.filter((s) => s !== status)
      : [...filters.statuses, status];
    onFilterChange({ ...filters, statuses: newStatuses });
  };

  const handleCompanyToggle = (company) => {
    const newCompanies = filters.companies.includes(company)
      ? filters.companies.filter((c) => c !== company)
      : [...filters.companies, company];
    onFilterChange({ ...filters, companies: newCompanies });
  };

  const handleReset = () => {
    onFilterChange({
      chargerTypes: [],
      statuses: [],
      companies: [],
      distance: 10,
    });
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-200 p-6 z-40 max-h-[80vh] overflow-y-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-teal-600" />
          <h3 className="font-bold text-gray-800">필터</h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 border rounded-lg text-gray-600 hover:bg-gray-100 flex items-center gap-1"
            onClick={handleReset}
          >
            <RotateCcw className="w-4 h-4" />
            초기화
          </button>

          <button
            className="p-2 rounded-lg hover:bg-gray-100"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Distance Slider */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-4 h-4 text-gray-500" />
          <span className="font-medium text-gray-700">거리</span>
          <span className="ml-auto px-2 py-1 text-sm rounded bg-gray-100 text-gray-700">
            {filters.distance}km 이내
          </span>
        </div>

        <input
          type="range"
          min="1"
          max="50"
          value={filters.distance}
          onChange={(e) =>
            onFilterChange({ ...filters, distance: Number(e.target.value) })
          }
          className="w-full cursor-pointer"
        />
      </div>

      {/* Status */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle className="w-4 h-4 text-gray-500" />
          <span className="font-medium text-gray-700">상태</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {statuses.map((status) => {
            const active = filters.statuses.includes(status.value);
            return (
              <span
                key={status.value}
                className={`px-3 py-1 rounded-full text-sm cursor-pointer border transition
                  ${
                    active
                      ? status.color + " border-transparent"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-300"
                  }
                `}
                onClick={() => handleStatusToggle(status.value)}
              >
                {status.label}
              </span>
            );
          })}
        </div>
      </div>

      {/* Charger Types */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-gray-500" />
          <span className="font-medium text-gray-700">충전기 타입</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {chargerTypes.map((type) => {
            const active = filters.chargerTypes.includes(type);
            return (
              <span
                key={type}
                className={`px-3 py-1 rounded-full text-sm cursor-pointer border transition
                  ${
                    active
                      ? "bg-teal-100 text-teal-700 border-transparent"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-300"
                  }
                `}
                onClick={() => handleTypeToggle(type)}
              >
                {type}
              </span>
            );
          })}
        </div>
      </div>

      {/* Companies */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Building2 className="w-4 h-4 text-gray-500" />
          <span className="font-medium text-gray-700">운영사</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {companies.map((company) => {
            const active = filters.companies.includes(company);
            return (
              <span
                key={company}
                className={`px-3 py-1 rounded-full text-sm cursor-pointer border transition
                  ${
                    active
                      ? "bg-cyan-100 text-cyan-700 border-transparent"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-300"
                  }
                `}
                onClick={() => handleCompanyToggle(company)}
              >
                {company}
              </span>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
