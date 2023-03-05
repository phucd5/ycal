import React from "react";
import Modal from "react-modal";
import "./App.css";
import Calendar from "./components/Calendar/Calendar";
import HomePage from "./components/HomePage/HomePage";

Modal.setAppElement("#root")
function App() {
  return (
    <div className="App">
     <Calendar />
    </div>
  );
}

export default App;
