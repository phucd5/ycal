import React from "react";
import "./App.css";
import Calendar from "./components/Calendar/Calendar";
import HomePage from "./components/HomePage/HomePage";
import RegistrationPage from "./components/RegistrationPage/RegistrationPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage/LoginPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/registration" element={<RegistrationPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/calendar/:userId" element={<Calendar />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
