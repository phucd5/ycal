// import { Form  } from "react-bootstrap"
import React, { useState } from "react";
import "./RegistrationPage.css"

const RegistrationPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(email);
  }

  return (
    <div className="auth-form-container">
      <form className="reg-form" onSubmit={handleSubmit}>
        <label htmlFor="firstName">First Name</label>
        <input value={firstName} onChange={(e) => setFirstName(e.target.value)} type="firstName" placeholder="John" id="firstName" name="firstName"/>
        <label htmlFor="lastName">Last Name</label>
        <input value={lastName} onChange={(e) => setLastName(e.target.value)} type="lastName" placeholder="Smith" id="lastName" name="lastName"/>
        <label htmlFor="email">Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="johnsmith@gmail.com" id="email" name="email"/>
        <label htmlFor="password">Password</label>
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="********" id="password" name="password"/>
        <button type="submit">Login</button>
      </form>
      <button className="link-button">Already have an account? Login here.</button>
    </div>
  )      
}

export default RegistrationPage;
