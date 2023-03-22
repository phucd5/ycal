import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './RegistrationPage.css'
import { Link } from "react-router-dom";

const RegistrationPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const linkStyle = {
    fontStyle: 'italic'
  }

  const handleRegister = () => {
    axios
      .post("http://localhost:3002/auth/register", {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
      })
      .then((response) => {
        console.log(response.data);
        navigate("/login");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div class="main-container">
      <h1>YCal</h1>
      <div class="entry-container">
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}   
          placeholder="first name"
        />
        
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="last name"
        />

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
        />
        <button class="submit-button" onClick={handleRegister}>register</button>
      </div>
      <br />
      <div>
        {""}
        <Link to="/login" style={linkStyle}>
          already have an account? login.
        </Link>
      </div>
    </div>
  );
};

export default RegistrationPage;
