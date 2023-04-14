import "./Calendar.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import React, { useState, useEffect, useRef } from "react";
import FriendsCalandar from "./FriendsCalandar";
import CreateEventForm from "../Dialog/CreateEventForm";
import AddFriendDialog from "../Dialog/AddFriend";
import EventDetailsDialog from "../Dialog/EventDetailsDialog";
import AddCourseDialog from "../Dialog/AddCourseDialog";

const Calendar = () => {
	const [modalShow, setModalShow] = useState(false);
	const [selectedEvent, setSelectedEvent] = useState(null);

	const handleModalShow = () => setModalShow(true);
	const handleModalClose = () => setModalShow(false);
	const handleSelectedEvent = (event) => setSelectedEvent(event);

	const navigate = useNavigate();
	const [user, setUser] = useState(null);
	const [events, setEvents] = useState([]);
	const [friends, setFriends] = useState([]);
	const [classes, setClasses] = useState([]);
	const calendarRef = useRef(null);

	useEffect(() => {
		const loggedInUser = localStorage.getItem("token");
		setUser(JSON.parse(localStorage.getItem("user")));

		if (!loggedInUser) {
			alert("Please login!");
			navigate("/login");
		}
	}, []);

	useEffect(() => {
		if (user && user._id) {
			fetchEvents();
			fetchClasses();
			fetchFriends();
		}
	}, [user]);

	async function fetchEvents() {
		try {
			const response = await axios.get(
				`http://localhost:3002/users/${user._id}/events`
			);
			setEvents(response.data);
		} catch (error) {
			console.error(error);
		}
	}

	async function fetchClasses() {
		const allClass = [];
		const classesResponse = await axios.get(
			`http://localhost:3002/users/${user._id}/classes`
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

	async function fetchFriends() {
		try {
			const response = await axios.get(
				`http://localhost:3002/users/${user._id}/friends`
			);
			setFriends(response.data);
		} catch (error) {
			console.error(error);
		}
	}

	const handleRemoveFriend = async (friendId) => {
		try {
			const response = await axios.put(
				`http://localhost:3002/users/${user._id}/friends`,
				{
					friendId: friendId,
					action: "remove",
				}
			);
			setFriends(response.data);
		} catch (error) {
			console.log(error);
		}
	};

	const handleEventClick = (info) => {
		handleSelectedEvent(info.event);
		handleModalShow();
	};

	return (
		<div>
			<h1> YCal </h1>
			<div class="container">
				<div class="item friends-item">
					<h2>Friends:</h2>
					<AddFriendDialog user={user} setFriends={setFriends} />
					<table style={{ marginTop: "10px" }}>
						<thead>
							<tr>
								<th>First Name</th>
								<th>Last Name</th>
								<th>Email</th>
							</tr>
						</thead>
						<tbody>
							{friends.map((friend) => (
								<tr key={friend._id}>
									<td>{friend.firstName}</td>
									<td>{friend.lastName}</td>
									<td>{friend.email}</td>
									<td>
										<button
											style={{
												marginRight: "15px",
												marginLeft: "15px",
											}}
											onClick={() =>
												handleRemoveFriend(friend._id)
											}
										>
											Delete Friend
										</button>
										<FriendsCalandar
											friendId={friend._id}
										></FriendsCalandar>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				<div class="item courses-item">
					<h2>Courses:</h2>
					<AddCourseDialog
						user={user}
						setEvents={setEvents}
						events={events}
					/>
				</div>
				<h2>My Calendar</h2>
				<div class="item events-item">
					<CreateEventForm
						user={user}
						setEvents={setEvents}
						friends={friends}
					/>
				</div>
				<div class="item calendar-item">
					<div>
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
							eventClick={(info) => handleEventClick(info)}
						/>
					</div>
					<EventDetailsDialog
						user={user}
						event={selectedEvent}
						fetchEvents={fetchEvents}
						setEvents={setEvents}
						show={modalShow}
						handleClose={handleModalClose}
					/>
				</div>
			</div>
		</div>
	);
};

export default Calendar;
