import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { validateYaleEmail } from "../../utils/valdiation";

function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (!validateYaleEmail(email)) {
			alert("Please enter a Yale email");
			return;
		}

		try {
			const response = await axios.post(
				`${process.env.REACT_APP_SERVER_API_URL}auth/login`,
				{
					email: email,
					password: password,
				}
			);

			localStorage.setItem("token", response.data.token);
			localStorage.setItem("user", JSON.stringify(response.data.user));
			navigate("/calendar");
		} catch (error) {
			alert("Password/Email is incorrect");
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
							required
						/>
						<input
							type="password"
							value={password}
							onChange={(event) =>
								setPassword(event.target.value)
							}
							placeholder="password"
							required
						/>
						<button className="submit-button" type="submit">
							log in
						</button>
					</form>
				</div>
				<br></br>
				<div>
					{""}
					<Link to="/registration">need an account? sign up.</Link>
				</div>
			</div>
		</div>
	);
}

const StyledLink = styled(Link)`
	color: #1e1e1e;
	font-style: italic;
	text-decoration: underline;
`;

export default LoginPage;
