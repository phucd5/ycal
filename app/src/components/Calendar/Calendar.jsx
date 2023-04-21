import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import FriendsCalandar from "./FriendsCalandar";


import CreateEventForm from "../Dialog/CreateEventForm";
import AddFriendDialog from "../Dialog/AddFriend";
import EventDetailsDialog from "../Dialog/EventDetailsDialog";
import AddCourseDialog from "../Dialog/AddCourseDialog";


import MeetingDialog from "../Dialog/MeetingDialog";
import CourseDetailsDialog from "../Dialog/CourseDetailsDialog";

import "./Calendar.css";
import styled from "./styles.scss";

const Calendar = () => {
	const navigate = useNavigate();

	const [eventModalShow, setEventModalShow] = useState(false);
	const [courseModalShow, setCourseModalShow] = useState(false);
	const [selectedEvent, setSelectedEvent] = useState(null);
	const [selectedCourse, setSelectedCourse] = useState(null);

	const handleEventModalShow = () => setEventModalShow(true);
	const handleEventModalClose = () => setEventModalShow(false);
	const handleCourseModalShow = () => setCourseModalShow(true);
	const handleCourseModalClose = () => setCourseModalShow(false);
	const handleSelectedEvent = (event) => setSelectedEvent(event);

	
	const [user, setUser] = useState(null);
	const [events, setEvents] = useState([]);
	const [friendRequests, setFriendRequests] = useState([]);
	const [friends, setFriends] = useState([]);
	const [courses, setCourses] = useState([]);
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
			fetchCourses();
			fetchFriendRequests();
			fetchFriends();
		}
	}, [user]);


	/* API Requests */

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

	async function fetchCourses() {
		const allClass = [];
		const classesResponse = await axios.get(
			`http://localhost:3002/users/${user._id}/classes`
		);

		for (const classObj of classesResponse.data) {
			const scheduleResponse = await axios.get(
				`http://localhost:3002/yclasses/${classObj._id}/schedule`
			);
			const scheduleData = scheduleResponse.data;

			for (const scheduleStuff of scheduleData) {
				allClass.push(scheduleStuff);
			}
		}

		setCourses(allClass);
	}

	const fetchCourseDetails = async (event) => {
		const classResponse = await axios.get(
			`http://localhost:3002/yclasses/${event.extendedProps.class}`
		);
		setSelectedCourse(classResponse.data);
	};

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

	async function fetchFriendRequests() {
		try {
			const response = await axios.get(
				`http://localhost:3002/users/${user._id}/friendrequests`
			);
			setFriendRequests(response.data);
		} catch (error) {
			console.error(error);
		}
	}


	/* Callback Functions Requests */

	const handleAddFriend = async (friendId, friendEmail) => {
		try {
			const response = await axios.get(
				`http://localhost:3002/users/${friendEmail}/email`
			);
			try {
				const response_2 = await axios.put(
					`http://localhost:3002/users/${user._id}/friends`,
					{
						friendId: response.data._id,
						action: "add",
					}
				);
				setFriends(response_2.data);
				handleRemoveFriendRequest(friendId);
			} catch (error) {
				alert("Person is already in your friend's list!");
			}
		} catch (error) {
			alert("Can't find friend", error);
		}
	};

	const handleRemoveFriendRequest = async (friendId) => {
		try {
			const response = await axios.put(
				`http://localhost:3002/users/${user._id}/friendrequests`,
				{
					friendId: friendId,
					action: "remove",
				}
			);
			setFriendRequests(response.data);
		} catch (error) {
			console.log(error);
		}
	};

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


	const handleEventClick = async (info) => {
		if (info.event.extendedProps.isClass) {
			await fetchCourseDetails(info.event);
			handleCourseModalShow();
		} else {
			handleSelectedEvent(info.event);
			handleEventModalShow();
		}
	};

	/* Render component functions */

	const renderFriendRequests = () => {
		return (
			<>
				<table style={{ marginTop: "10px" }}>
					<thead>
						<tr>
							<th>First Name</th>
							<th>Last Name</th>
							<th>Email</th>
						</tr>
					</thead>
					<tbody>
						{friendRequests.map((friend) => (
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
											handleRemoveFriendRequest(
												friend._id
											)
										}
									>
										Delete Request
									</button>
									<button
										style={{
											marginRight: "15px",
											marginLeft: "15px",
										}}
										onClick={() =>
											handleAddFriend(
												friend._id,
												friend.email
											)
										}
									>
										Add Friend
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</>
		);
	};

	const renderFriendsLists = () => {
		return (
			<>
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
			</>
		);
	};

	const renderDialogs = () => {
		return (
			<>
				<EventDetailsDialog
					user={user}
					event={selectedEvent}
					fetchEvents={fetchEvents}
					setEvents={setEvents}
					show={eventModalShow}
					handleClose={handleEventModalClose}
				/>
				<CourseDetailsDialog
					user={user}
					course={selectedCourse}
					fetchCourses={fetchCourses}
					show={courseModalShow}
					handleClose={handleCourseModalClose}
				/>
				<MeetingDialog user={user} friends={friends} />
			</>
		);
	};
	return (
		<div>
			<h1>
				<strong>YCal</strong>
			</h1>
			<div className={styled.bootstrap}>
				<AddFriendDialog user={user} />
				<div class="container">
					<div class="item-friends-item">
						{renderFriendRequests()}
						{renderFriendsLists()}
					</div>
					<div class="item-courses-item">
						<h2>Courses:</h2>
						<AddCourseDialog
							user={user}
							fetchClasses={fetchCourses}
						/>
					</div>
					<h2>My Calendar</h2>
					<div class="item-events-item">
						<CreateEventForm
							user={user}
							friends={friends}
							fetchEvents={fetchEvents}
						/>
					</div>
					<div class="item-calendar-item">
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
								events={[...events, ...courses]}
								eventClick={(info) => handleEventClick(info)}
							/>
						</div>
						{renderDialogs()}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Calendar;
