import React from "react";
import "./App.css";
import Calendar from "./components/Calendar/Calendar";
import HomePage from "./components/HomePage/HomePage";
import RegPage from "./components/RegPage/RegPage"
import LoginPage from "./components/LoginPage/LoginPage"

function App() {
  return (
    <div className="App">
      <RegPage></RegPage>
    </div>
  );
}

export default App;
