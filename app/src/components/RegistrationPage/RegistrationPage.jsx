// // import { Form  } from "react-bootstrap"
// import React, { useState } from "react";
// import "./RegistrationPage.css"

// const RegistrationPage = () => {
//   const [firstName, setFirstName] = useState('');
//   const [lastName, setLastName] = useState('');
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
//         <label htmlFor="firstName">First Name</label>
//         <input value={firstName} onChange={(e) => setFirstName(e.target.value)} type="firstName" placeholder="John" id="firstName" name="firstName"/>
//         <label htmlFor="lastName">Last Name</label>
//         <input value={lastName} onChange={(e) => setLastName(e.target.value)} type="lastName" placeholder="Smith" id="lastName" name="lastName"/>
//         <label htmlFor="email">Email</label>
//         <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="johnsmith@gmail.com" id="email" name="email"/>
//         <label htmlFor="password">Password</label>
//         <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="********" id="password" name="password"/>
//         <button type="submit">Login</button>
//       </form>
//       <button className="link-button">Already have an account? Login here.</button>
//     </div>
//     </div>
//   )
// }

// export default RegistrationPage;

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
