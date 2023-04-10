import React from "react";
import Modal from "react-modal";
import "./App.css";
import Calendar from "./components/Calendar/Calendar";
import RegistrationPage from "./components/RegistrationPage/RegistrationPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage/LoginPage";
import 'bootstrap/dist/css/bootstrap.min.css';

Modal.setAppElement("#root");
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/registration" element={<RegistrationPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/calendar" element={<Calendar />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
