import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

const AISchedule = ({ user, friends }) => {
	const [allEvents, setallEvents] = useState([]);

	const fetchFriendsEvents = async () => {
		const today = new Date(); // current time
		const oneWeekFromNow = new Date(
			today.getFullYear(),
			today.getMonth(),
			today.getDate() + 7
		); // current time plus 1 week

		let eventsData = [];
		for (const friend of friends) {
			try {
				const response = await axios.get(
					`http://localhost:3002/users/${friend._id}/events`
				);

				const filteredEvents = response.data.filter((event) => {
					const startTime = new Date(event.start);
					return startTime >= today && startTime <= oneWeekFromNow;
				});
				const allClass = [];
				const classesResponse = await axios.get(
					`http://localhost:3002/users/${friend._id}/classes`
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

				const filteredClasses = allClass.filter((event) => {
					const startTime = new Date(event.start);
					return startTime >= today && startTime <= oneWeekFromNow;
				});
				if (filteredEvents.length > 0 || filteredClasses.length > 0) {
					eventsData.push({
						friend: friend.firstName,
						events: [...filteredEvents, ...filteredClasses],
					});
				}
			} catch (error) {
				console.error(error);
			}
		}

		const formattedEvents = eventsData.map(({ friend, events }) => {
			const eventsString = events
				.map(({ start, end }) => `Event: ${start} - ${end}`)
				.join("\n");
			return `${friend}:\n${eventsString}`;
		});

		setallEvents(formattedEvents);

		let gpt_string =
			"Given these events, find the most optimal time for these users to have a meeting:";
		setallEvents((prev) => [gpt_string, ...prev]);
	};

	useEffect(() => {
		friends.push(user);
		fetchFriendsEvents();
	}, []);

	return (
		<div>
			<h1>AI Schedule</h1>
			{allEvents.map((eventString, index) => (
				<p key={index}>{eventString}</p>
			))}
		</div>
	);
};

export default AISchedule;
