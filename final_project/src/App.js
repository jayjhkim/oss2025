import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";

import MapPage from "./pages/Map";
import Favorites from "./pages/Favorites";
import Reservations from "./pages/Reservations";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          
          {/* "/" 들어오면 기본적으로 Map으로 이동 */}
          <Route index element={<Navigate to="/Map" replace />} />  

          <Route path="Map" element={<MapPage />} />
          <Route path="Favorites" element={<Favorites />} />
          <Route path="Reservations" element={<Reservations />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
