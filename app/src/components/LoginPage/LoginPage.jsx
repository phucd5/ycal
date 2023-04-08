import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import styled from 'styled-components';


function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

const handleSubmit = async (event) => {
  event.preventDefault();

  try {
    const response = await axios.post(
      "http://localhost:3002/auth/login",
      {
        email: email,
        password: password,
      }
    );

    console.log(response.data);
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
    navigate("/calendar");
  } catch (error) {
    alert("Wrong information!");
    console.error(error);
  }
};

  return (
    <div className="login-page">
    <div className="main-container">
      <div className="ycal-title">YCal</div>
      <div className="entry-container">
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="email"
          />
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="password"
          />
          <button className="submit-button" type="submit">log in</button>
        </form>
      </div>
      <br></br>
      <div>
        {""}
        <Link to="/registration">
          need an account? sign up.
        </Link>
      </div>
    </div>
    </div>
  );
}

const StyledLink = styled(Link)`
color: #1E1E1E;
font-style: italic;
text-decoration: underline;
`;

export default LoginPage;
