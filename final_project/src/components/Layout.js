// Layout.jsx
import { Outlet, Link, useLocation } from "react-router-dom";
import { Map, Heart, Calendar, Zap } from "lucide-react";

export default function Layout() {
  const location = useLocation();
  const currentPage = location.pathname.replace("/", "") || "Map";

  const navItems = [
    { name: "Map", label: "지도", icon: Map },
    { name: "Favorites", label: "즐겨찾기", icon: Heart },
    { name: "Reservations", label: "예약", icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Desktop Side Navigation */}
      <nav className="fixed left-0 top-0 h-full w-20 bg-white/95 backdrop-blur-md 
                      border-r border-slate-200 flex flex-col items-center py-6 z-50 shadow-sm">

        {/* Logo */}
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-500 
                        flex items-center justify-center mb-8 shadow-md">
          <Zap className="w-6 h-6 text-white" />
        </div>

        {/* Menu */}
        <div className="flex flex-col gap-4 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.name;

            return (
              <Link
                key={item.name}
                to={`/${item.name}`}
                className={`relative flex flex-col items-center gap-1 px-4 py-3 rounded-xl 
                          transition-all group cursor-pointer
                          ${isActive 
                            ? "text-teal-600 bg-teal-50" 
                            : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                          }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>

                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 
                                  w-1 h-8 bg-teal-500 rounded-r-full" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Right side content (with sidebar offset) */}
      <div className="ml-20 p-6">
        <Outlet />
      </div>

    </div>
  );
}
