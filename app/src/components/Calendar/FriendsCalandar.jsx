import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

const FriendsCalandar = ({ friendId }) => {
	const [events, setEvents] = useState([]);
	const [friend, setFriend] = useState([]);
	const [show, setShow] = useState(false);
	const calendarRef = useRef(null);
	const [classes, setClasses] = useState([]);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	const fetchFriend = async () => {
		try {
			const response = await axios.get(
				`http://localhost:3002/users/${friendId}`
			);
			setFriend(response.data);
		} catch (error) {
			console.error(error);
		}
	};

	const fetchEvents = async () => {
		try {
			const response = await axios.get(
				`http://localhost:3002/users/${friendId}/events`
			);
			setEvents(response.data);
		} catch (error) {
			console.error(error);
		}
	};

	async function fetchClasses() {
		const allClass = [];
		const classesResponse = await axios.get(
			`http://localhost:3002/users/${friendId}/classes`
		);
		const classesData = classesResponse.data;

		for (const classObj of classesData) {
			const scheduleResponse = await axios.get(
				`http://localhost:3002/yclasses/${classObj._id}/schedule`
			);
			const scheduleData = scheduleResponse.data;

			for (const scheduleStuff of scheduleData) {
				allClass.push(scheduleStuff);
			}
		}

		setClasses(allClass);
	}

	useEffect(() => {
		fetchFriend();
		fetchEvents();
		fetchClasses();
	}, [friendId]);

	return (
		<>
			<Button variant="primary" onClick={handleShow}>
				View Calendar
			</Button>
			<Modal
				size="lg"
				show={show}
				onHide={handleClose}
				backdrop="static"
				keyboard={false}
			>
				<Modal.Header closeButton>
					<Modal.Title id="friends-calendar-title">
						{friend.firstName}'s Events
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<FullCalendar
						timeZone="UTC"
						ref={calendarRef}
						plugins={[
							dayGridPlugin,
							timeGridPlugin,
							interactionPlugin,
						]}
						initialView="timeGridWeek"
						events={[...events, ...classes]}
					/>
				</Modal.Body>
			</Modal>
		</>
	);
};

export default FriendsCalandar;
