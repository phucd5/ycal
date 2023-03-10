// // import { Form  } from "react-bootstrap"
// import React, { useState } from "react";
// import "../RegistrationPage/RegistrationPage.css"

// const LoginPage = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleSubmit = (e) => {
//     e.preventDefault()
//     console.log(email);
//   }

//   return (
//     <div className="login_page">
//     <div className="auth-form-container">
//       <form className="reg-form" onSubmit={handleSubmit}>
//         <label htmlFor="email">Email</label>
//         <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="johnsmith@gmail.com" id="email" name="email"/>
//         <label htmlFor="password">Password</label>
//         <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="********" id="password" name="password"/>
//         <button type="submit">Register</button>
//       </form>
//       <button className="link-button">Don't have an account? Register here.</button>
//     </div>
//     </div>
//   )
// };

// export default LoginPage;

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
