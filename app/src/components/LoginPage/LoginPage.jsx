import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const linkStyle = {
    fontStyle: 'italic'
  }

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
    <div class="main-container">
      <h1>YCal</h1>
      <div class="entry-container">
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
          <button class="submit-button" type="submit">login</button>
        </form>
      </div>
      <br></br>
      <div>
        {""}
        <Link to="/registration" style={linkStyle}>
          need an account? sign up.
        </Link>
      </div>
    </div>
  );
}

export default LoginPage;
