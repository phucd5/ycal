import React from "react";
import "./App.css";
import Calendar from "./components/Calendar/Calendar";
import HomePage from "./components/HomePage/HomePage";
import RegPage from "./components/RegPage/RegPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/reg" element={<RegPage />} />
          <Route path="/calendar/:userId" element={<Calendar />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
