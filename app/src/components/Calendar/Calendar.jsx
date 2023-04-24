import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import CreateEventForm from "../Dialog/CreateEventForm";
import EventDetailsDialog from "../Dialog/EventDetailsDialog";
import AddCourseDialog from "../Dialog/AddCourseDialog";
import FriendsDialog from "../Dialog/FriendsDialog";

import MeetingDialog from "../Dialog/MeetingDialog";
import CourseDetailsDialog from "../Dialog/CourseDetailsDialog";

import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import BookIcon from "@mui/icons-material/Book";
import GroupsIcon from "@mui/icons-material/Groups";
import ScheduleIcon from "@mui/icons-material/Schedule";

import "./Calendar.css";
import styled from "./styles.scss";

const fabStyles = {
    backgroundColor: "#023663", // Replace with your desired color
    color: "#57b6fa"
};

const fabStyles1 = {
    backgroundColor: "#57b6fa", // Replace with your desired color
    color: "#023663"
}

const Calendar = () => {
	const navigate = useNavigate();

	const [eventModalShow, setEventModalShow] = useState(false);
	const [courseModalShow, setCourseModalShow] = useState(false);
	const [friendsModalShow, setFriendsModalShow] = useState(false);
	const [addCourseModalShow, setAddCourseModalShow] = useState(false);
	const [addEventModalShow, setAddEventModalShow] = useState(false);
	const [meetingModalShow, setMeetingModalShow] = useState(false);
	const [selectedEvent, setSelectedEvent] = useState(null);
	const [selectedCourse, setSelectedCourse] = useState(null);
	// const [courseCode, setCourseCode] = useState("");
	// const [searchedCourses, setSearchedCourses] = useState([]);

	const handleEventModalShow = () => setEventModalShow(true);
	const handleEventModalClose = () => setEventModalShow(false);
	const handleCourseModalShow = () => setCourseModalShow(true);
	const handleCourseModalClose = () => setCourseModalShow(false);
	const handleFriendsModalShow = () => setFriendsModalShow(true);
	const handleFriendsModalClose = () => setFriendsModalShow(false);
	const handleAddCourseModalShow = () => setAddCourseModalShow(true);
	const handleAddEventModalShow = () => setAddEventModalShow(true);
	const handleMeetingModalShow = () => setMeetingModalShow(true);

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

	const handleEventClick = async (info) => {
		if (info.event.extendedProps.isClass) {
			await fetchCourseDetails(info.event);
			handleCourseModalShow();
		} else {
			handleSelectedEvent(info.event);
			handleEventModalShow();
		}
	};

	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		navigate("/login");
	};

	/* Reunder Functions */

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
				<MeetingDialog
					user={user}
					friends={friends}
					show={meetingModalShow}
					setShow={setMeetingModalShow}
					handleShow={handleMeetingModalShow}
					f
				/>
				<AddCourseDialog
					user={user}
					fetchClasses={fetchCourses}
					show={addCourseModalShow}
					setShow={setAddCourseModalShow}
					handleShow={setAddCourseModalShow}
				/>
				<CreateEventForm
					user={user}
					friends={friends}
					fetchEvents={fetchEvents}
					show={addEventModalShow}
					setShow={setAddEventModalShow}
					handleShow={handleAddEventModalShow}
				/>
				<FriendsDialog
					user={user}
					friends={friends}
					friendRequests={friendRequests}
					setFriends={setFriends}
					setFriendRequests={setFriendRequests}
					show={friendsModalShow}
					handleShow={handleFriendsModalShow}
					handleClose={handleFriendsModalClose}
				/>
			</>
		);
	};

	const renderFAB = () => {
		return (
			<>
				<Box
					sx={{ "& > :not(style)": { m: 1 } }}
					position="fixed"
					bottom="0"
					right="0"
				>
					<Tooltip title="Add Event">
						<Fab
							color="primary"
							aria-label="addEvent"
							onClick={handleAddEventModalShow}
							position="fixed"
                            style={fabStyles1}
						>
							<AddIcon />
						</Fab>
					</Tooltip>
					<Tooltip title="Add Course">
						<Fab
							color="primary"
							aria-label="addCourse"
							onClick={handleAddCourseModalShow}
                            style={fabStyles}
						>
							<BookIcon />
						</Fab>
					</Tooltip>
					<Tooltip title="Schedule Meeting">
						<Fab
							color="primary"
							aria-label="scheduleMeeting"
							onClick={handleMeetingModalShow}
                            style={fabStyles}
						>
							<ScheduleIcon />
						</Fab>
					</Tooltip>
					<Tooltip title="My Friends">
						<Fab
							color="primary"
							aria-label="friends"
							onClick={handleFriendsModalShow}
                            style={fabStyles}
						>
							<GroupsIcon />
						</Fab>
					</Tooltip>
				</Box>
			</>
		);
	};

	return (
		<div>
			<div class="topBarContainer">
				<h1 class="YCal-logo">YCal</h1>
				<button class="logout-button" onClick={handleLogout}>
					Log out
				</button>
			</div>
			<div className={styled.bootstrap}>
				<div class="container">
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
								aspectRatio="2.5"
							/>
						</div>
						{renderDialogs()}
					</div>
					{renderFAB()}
				</div>
			</div>
		</div>
	);
};

export default Calendar;
