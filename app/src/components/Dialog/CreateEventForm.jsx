import axios from "axios";
import React, { useState } from "react";

import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/button";
import { validateDate } from "../../utils/valdiation";

const CreateEventForm = (props) => {
	const { user, friends, fetchEvents } = props;

	const [show, setShow] = useState(false);
	const handleClose = (event) => {
		setShow(false);
	};
	const handleShow = () => setShow(true);

	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [startTime, setStartTime] = useState("");
	const [endTime, setEndTime] = useState("");
	const [location, setLocation] = useState("");
	const [locationMarker, setLocationMarker] = useState("None");
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
			alert(validateCalInput.err);
			return;
		}
		try {
			const response = await axios.post(
				"http://localhost:3002/events/create",
				{
					organizer: user,
					title,
					description,
					start: new Date(
						startDate.concat("T").concat(startTime).concat("Z")
					),
					end: new Date(
						endDate.concat("T").concat(endTime).concat("Z")
					),
					location,
					userId: user._id,
					location_marker: locationMarker,
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

				fetchEvents();
				setTitle("");
				setDescription("");
				setStartDate("");
				setEndDate("");
				setStartTime("");
				setEndTime("");
				setLocation("");
				setAttendees([]);
				handleClose();
			} catch (error) {
				console.log(error);
				handleClose();
			}
		} catch (error) {
			console.log(error);
			handleClose();
		}
	};

	return (
		<>
			<Button variant="primary" onClick={handleShow}>
				New Event
			</Button>

			<Modal
				show={show}
				onHide={handleClose}
				backdrop="static"
				keyboard={false}
			>
				<Modal.Header closeButton>
					<Modal.Title>New Event</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={handleSubmit}>
						<Form.Group>
							<Form.Label>Title:</Form.Label>
							<Form.Control
								type="text"
								value={title}
								className="input-box"
								onChange={(e) => setTitle(e.target.value)}
								required
							/>
						</Form.Group>
						<br />
						<Form.Group>
							<Form.Label>Description:</Form.Label>
							<Form.Control
								type="text"
								value={description}
								className="input-box"
								onChange={(e) => setDescription(e.target.value)}
								required
							/>
						</Form.Group>
						<br />
						<Form.Group>
							<Form.Label>Start Date:</Form.Label>
							<Form.Control
								type="date"
								value={startDate}
								className="input-box"
								onChange={(e) => setStartDate(e.target.value)}
								required
							/>
						</Form.Group>
						<br />
						<Form.Group>
							<Form.Label>Start Time:</Form.Label>
							<Form.Control
								type="time"
								value={startTime}
								className="input-box"
								onChange={(e) => setStartTime(e.target.value)}
								required
							/>
						</Form.Group>
						<br />
						<Form.Group>
							<Form.Label>End Date:</Form.Label>
							<Form.Control
								type="date"
								value={endDate}
								className="input-box"
								onChange={(e) => setEndDate(e.target.value)}
								required
							/>
						</Form.Group>
						<br />
						<Form.Group>
							<Form.Label>End Time:</Form.Label>
							<Form.Control
								type="time"
								value={endTime}
								className="input-box"
								onChange={(e) => setEndTime(e.target.value)}
								required
							/>
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
							/>
						</Form.Group>
						<Form.Group>
							<Form.Label>Yale Location:</Form.Label>
							<Form.Select
								value={locationMarker}
								onChange={(e) =>
									setLocationMarker(e.target.value)
								}
							>
								<option value="">Select a Yale location</option>
								<option value="PWG">PWG</option>
								<option value="Silliman Buttery">
									Silliman Buttery
								</option>
								<option value="Bass Library">
									Bass Library
								</option>
							</Form.Select>
						</Form.Group>
						<Form.Group>
							<Form.Label>Attendees:</Form.Label>
							{friends.map((friend) => (
								<Form.Check
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
						<Button variant="primary" type="submit">
							Submit
						</Button>
					</Form>
				</Modal.Body>
				<Modal.Footer></Modal.Footer>
			</Modal>
		</>
	);
};

export default CreateEventForm;
