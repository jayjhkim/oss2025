import React from "react";
import { Routes, Route } from "react-router-dom";

import ListPage from "./components/ListPage";
import DetailPage from "./components/DetailPage";
import CreatePage from "./components/CreatePage";
import UpdatePage from "./components/UpdatePage";

function App() {
  return (
    <div className="container mt-4">
      <Routes>
        <Route path="/" element={<ListPage />} />
        <Route path="/list" element={<ListPage />} />
        <Route path="/detail/:id" element={<DetailPage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/update/:id" element={<UpdatePage />} />
      </Routes>
    </div>
  );
}

export default App;
