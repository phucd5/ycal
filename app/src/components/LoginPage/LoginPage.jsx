// import { Form  } from "react-bootstrap"
import React, { useState } from "react";
import "../RegPage/RegPage.css"

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(email);
  }

  return (
    <div className="auth-form-container">
      <form className="reg-form" onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="johnsmith@gmail.com" id="email" name="email"/>
        <label htmlFor="password">Password</label>
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="********" id="password" name="password"/>
        <button type="submit">Register</button>
      </form>
      <button className="link-button">Don't have an account? Register here.</button>
    </div>
  )      
};

export default LoginPage;
