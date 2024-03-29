import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./RegistrationPage.css";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { validateYaleEmail, validateRegInput } from "../../utils/valdiation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RegistrationPage = () => {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();

	const handleRegister = () => {
		if (!validateYaleEmail(email)) {
			toast.error("Error: Please enter a Yale email");
			return;
		}

		const validate = validateRegInput(firstName, lastName, password);
		if (!validate.valid) {
			alert(validate.err);
			return;
		}

		axios
			.post(`${process.env.REACT_APP_SERVER_API_URL}auth/register`, {
				firstName: firstName,
				lastName: lastName,
				email: email,
				password: password,
			})
			.then((response) => {
				navigate("/login");
			})
			.catch((error) => {
				toast.error("Error: User already have an account");
			});
	};

	return (
		<div className="reg-page">
			<ToastContainer
				position="top-center"
				newestOnTop={true}
				autoClose={2000}
				closeOnClick
				rtl={false}
				pauseOnHover={false}
				theme="colored"
			/>
			<div className="main-container">
				<div className="ycal-title">YCal</div>
				<div className="entry-container">
					<input
						type="text"
						value={firstName}
						onChange={(e) => setFirstName(e.target.value)}
						placeholder="first name"
						required
					/>

					<input
						type="text"
						value={lastName}
						onChange={(e) => setLastName(e.target.value)}
						placeholder="last name"
						required
					/>

					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="email"
						required
					/>

					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder="password"
						required
					/>
					<button
						className="submit-button"
						type="submit"
						onClick={handleRegister}
					>
						register
					</button>
				</div>
				<br />
				<div>
					{""}
					<StyledLink to="/login">
						already have an account? login.
					</StyledLink>
				</div>
			</div>
		</div>
	);
};

const StyledLink = styled(Link)`
	color: #1e1e1e;
	font-style: italic;
	text-decoration: underline;
`;

export default RegistrationPage;
