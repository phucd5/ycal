import React, { useState } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

const AddFriendDialog = (props) => {
	const { user, setFriends } = props;

	const [email, setEmail] = useState("");
	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const handleEmailChange = (event) => {
		setEmail(event.target.value);
	};


	const handleAddFriendRequest = async (event) => {
		event.preventDefault();
		try {
			const response = await axios.get(
				`http://localhost:3002/users/${email}/email`
			);
			try {
				const response_2 = await axios.put(
					`http://localhost:3002/users/${user._id}/friendrequests`,
					{
						friendId: response.data._id,
						action: "add",
					}

				);
				alert("Friend request sent!");
			} catch (error) {
				alert("Person is already in your friend's list or request already sent!");
			}
		} catch (error) {
			alert("Can't find user", error);
		}
		handleClose();
	};


	return (
		<>
			<Button variant="primary" onClick={handleShow}>
				Add Friend
			</Button>
			<Modal
				show={show}
				onHide={handleClose}
				backdrop="static"
				keyboard={false}
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
