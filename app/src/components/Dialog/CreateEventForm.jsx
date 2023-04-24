import axios from "axios";
import React, { useState } from "react";

import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { validateDate } from "../../utils/valdiation";
import "./CreateEventForm.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateEventForm = (props) => {
	const { user, friends, fetchEvents, show, setShow, handleShow } = props;

	const handleClose = () => {
		clearEventFields();
		setShow(false);
	};

	const handleCloseSuccess = () => {
		toast.success("Sucessfully added event");
		setShow(false);
		clearEventFields();
	};

	const handleCloseError = () => {
		toast.error("Failed to add event");
		setShow(false);
		clearEventFields();
	};

	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [startTime, setStartTime] = useState("");
	const [endTime, setEndTime] = useState("");
	const [location, setLocation] = useState("");
	const [attendees, setAttendees] = useState([]);

	/* Callback Functions */

	const handleCheck = (targetCheck, friendId) => {
		const isChecked = targetCheck;
		if (isChecked) {
			setAttendees((prevAttendees) => [...prevAttendees, friendId]);
		} else {
			setAttendees((prevAttendees) =>
				prevAttendees.filter((id) => id !== friendId)
			);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const newStart = new Date(
			startDate.concat("T").concat(startTime).concat("Z")
		);
		const newEnd = new Date(
			endDate.concat("T").concat(endTime).concat("Z")
		);

		const validateCalInput = validateDate(newStart, newEnd);

		if (!validateCalInput.valid) {
			toast.error(validateCalInput.err);
			return;
		}
		try {
			const response = await axios.post(
				"http://localhost:3002/events/create",
				{
					organizer: user,
					title,
					description,
					start: newStart,
					end: newEnd,
					location,
					userId: user._id,
					attendees,
				}
			);
			try {
				const response_2 = await axios.put(
					`http://localhost:3002/users/${user._id}/events`,
					{
						eventId: response.data._id,
						action: "add",
					}
				);

				clearEventFields();
				handleCloseSuccess();
			} catch (error) {
				console.log(error);
				handleCloseError();
			}
		} catch (error) {
			console.log(error);
			handleCloseError();
		}
	};

	function clearEventFields() {
		fetchEvents();
		setTitle("");
		setDescription("");
		setStartDate("");
		setEndDate("");
		setStartTime("");
		setEndTime("");
		setLocation("");
		setAttendees([]);
	}

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
			<Modal
				show={show}
				onHide={handleClose}
				backdrop="static"
				keyboard={true}
				dialogClassName="custom-modal"
				centered
			>
				<Modal.Header closeButton size="sm"></Modal.Header>
				<Modal.Body>
					<Form onSubmit={handleSubmit}>
						<Form.Group>
							<Form.Control
								type="text"
								value={title}
								className="input-box"
								onChange={(e) => setTitle(e.target.value)}
								required
								size="lg"
								placeholder="Add Event Title"
								style={{
									fontWeight: "bold",
									fontStyle: "normal",
								}}
							/>
						</Form.Group>
						<br />
						<Form.Group as={Row}>
							<Form.Label
								column
								sm={2}
								style={{ fontWeight: "bold", fontSize: "15px" }}
							>
								Start
							</Form.Label>
							<Col sm={4}>
								<Form.Control
									type="date"
									value={startDate}
									className="input-box"
									onChange={(e) =>
										setStartDate(e.target.value)
									}
									required
									size="sm"
								/>
							</Col>
							<Col sm={4}>
								<Form.Control
									type="time"
									value={startTime}
									className="input-box"
									onChange={(e) =>
										setStartTime(e.target.value)
									}
									required
									size="sm"
								/>
							</Col>
						</Form.Group>
						<br />
						<Form.Group as={Row}>
							<Form.Label
								column
								sm={2}
								style={{ fontWeight: "bold", fontSize: "15px" }}
							>
								End
							</Form.Label>
							<Col sm={4}>
								<Form.Control
									type="date"
									value={endDate}
									className="input-box"
									onChange={(e) => setEndDate(e.target.value)}
									required
									size="sm"
								/>
							</Col>
							<Col sm={4}>
								<Form.Control
									type="time"
									value={endTime}
									className="input-box"
									onChange={(e) => setEndTime(e.target.value)}
									required
									size="sm"
								/>
							</Col>
						</Form.Group>
						<br />
						<Form.Group>
							<Form.Label>Location:</Form.Label>
							<Form.Control
								type="text"
								value={location}
								className="input-box"
								onChange={(e) => setLocation(e.target.value)}
								required
								size="sm"
							/>
						</Form.Group>
						<br />
						<Form.Group>
							<Form.Label>Attendees:</Form.Label>
							{friends.map((friend) => (
								<Form.Check
									size="sm"
									key={friend._id}
									type="checkbox"
									id={friend._id}
									label={`${friend.firstName} ${friend.lastName}`}
									checked={attendees.includes(friend._id)}
									onChange={(e) => {
										handleCheck(
											e.target.checked,
											friend._id
										);
									}}
								/>
							))}
						</Form.Group>
						<br />
						<Form.Group>
							<Form.Label
								style={{ fontWeight: "bold", fontSize: "15px" }}
							>
								Description
							</Form.Label>
							<Form.Control
								type="text"
								value={description}
								className="input-box"
								onChange={(e) => setDescription(e.target.value)}
								required
								size="sm"
							/>
						</Form.Group>
						<Form.Group className="text-center">
							<Button
								variant="primary"
								type="submit"
								className="float-left"
							>
								Submit
							</Button>
						</Form.Group>
					</Form>
				</Modal.Body>
			</Modal>
		</>
	);
};

export default CreateEventForm;
