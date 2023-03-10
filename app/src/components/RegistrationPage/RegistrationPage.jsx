import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegistrationPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = () => {
    axios
      .post("http://localhost:3000/auth/register", {
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
    <div>
      <h2>YCal Registration</h2>
      <div>First Name</div>
      <input
        type="text"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />
      <div>Last Name</div>
      <input
        type="text"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />
      <div>Email</div>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <div>Password</div>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <br></br>
      <button onClick={handleRegister}>Register</button>
    </div>
  );
};

export default RegistrationPage;
