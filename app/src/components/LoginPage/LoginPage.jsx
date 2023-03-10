import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

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
    <div>
      <h2>YCal Login Page</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <div>Email</div>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <br></br>
        <div>
          <div>Password</div>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <br></br>
        <button type="submit">Login</button>
      </form>
      <br></br>
      <div>
        Need an account?{" "}
        <Link to="/registration">Register here</Link>
      </div>
    </div>
  );
}

export default LoginPage;
