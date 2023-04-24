import React, { useState } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import "./CreateEventForm.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddFriendDialog = (props) => {
	const { user } = props;

	const handleClose = (event) => {
		setEmail("");
		setShow(false);
	};
	const handleShow = () => setShow(true);

	const handleCloseSuccess = (msg) => {
		toast.success(msg);
		setShow(false);
		setEmail("");
	};

	const handleCloseError = (msg) => {
		toast.error(msg);
		setShow(false);
		setEmail("");
	};

	const [email, setEmail] = useState("");
	const [show, setShow] = useState(false);

	/* Callback functions */
	const handleEmailChange = (event) => {
		setEmail(event.target.value);
	};

	const handleAddFriendRequest = async (event) => {
		event.preventDefault();
		try {
			const friendResponse = await axios.get(
				`http://localhost:3002/users/${email}/email`
			);
			try {
				await axios.put(
					`http://localhost:3002/users/${user._id}/friendrequests`,
					{
						friendId: friendResponse.data._id,
						action: "add",
					}
				);
				handleCloseSuccess("Sucessfully added friend");
			} catch (error) {
				handleCloseError(
					"Person is already in your friend's list or request already sent!"
				);
			}
		} catch (error) {
			handleCloseError("Can't find user");
		}
	};

	return (
		<>
			<ToastContainer
				position="top-center"
				newestOnTop={true}
				autoClose={2000}
				closeOnClick
				rtl={false}
				pauseOnHover={false}
				theme="colored"
			/>
			<Button variant="primary" onClick={handleShow}>
				Add Friend
			</Button>
			<Modal
				show={show}
				onHide={handleClose}
				backdrop="static"
				keyboard={false}
				className="custom-modal"
			>
				<Modal.Header closeButton>
					<Modal.Title id="add-friend-modal-title">
						Add Friend
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={handleAddFriendRequest}>
						<Form.Group className="mb-3" controlId="formAddFriend">
							<Form.Label htmlFor="email">
								Email address:{" "}
							</Form.Label>
							<Form.Control
								className="input-box"
								type="email"
								id="email"
								value={email}
								onChange={handleEmailChange}
							/>
							<Button type="submit">Add Friend</Button>
						</Form.Group>
					</Form>
				</Modal.Body>
			</Modal>
		</>
	);
};

export default AddFriendDialog;
