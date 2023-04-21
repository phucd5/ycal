import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const { Configuration, OpenAIApi } = require("openai");

const AISchedule = (props) => {

	const { user, friends, meetingDate, meetingLength} = props;


	
	const [loading, setLoading] = useState(false);
	const [GPTResponse, setGPTResponse] = useState("");
	

	const openAi = new OpenAIApi(
		new Configuration({
			apiKey: "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",
		})
	);

	const askGPT = async (prompt) => {
		setLoading(true);
		if (prompt !== "") {
			const completion = await openAi.createChatCompletion({
				model: "gpt-3.5-turbo",
				messages: [{ role: "user", content: prompt }],
			});
			setGPTResponse(completion.data.choices[0].message.content);
			setLoading(false);
		} else {
			setLoading(false);
		}
		console.log(prompt);
	};

	
	const fetchFriendsEvents = async () => {
		const today = new Date();
		const oneWeekFromNow = new Date(
			today.getFullYear(),
			today.getMonth(),
			today.getDate() + 7
		);

		const new_friends = [...friends, user._id];
		let eventsData = [];
		const allClass = [];

		for (const friendId of new_friends) {
			try {
				const userResponse = await axios.get(
					`http://localhost:3002/users/${friendId}`
				);

				const response = await axios.get(
					`http://localhost:3002/users/${friendId}/events`
				);

				const classesResponse = await axios.get(
					`http://localhost:3002/users/${friendId}/classes`
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

				const filteredEvents = response.data.filter((event) => {
					const startTime = new Date(event.start);
					return startTime >= today && startTime <= oneWeekFromNow;
				});

				const filteredClasses = allClass.filter((event) => {
					const startTime = new Date(event.start);
					return startTime >= today && startTime <= oneWeekFromNow;
				});

				if (filteredEvents.length > 0 || filteredClasses.length > 0) {
					eventsData.push({
						friend: userResponse.data.firstName,
						events: [...filteredEvents, ...filteredClasses],
					});
				}
			} catch (err) {
				console.log(err);
			}
		}

		const formattedEvents = eventsData.map(({ friend, events }) => {
			const eventsString = events
				.map(({ start, end }) => `Event: ${start} - ${end}`)
				.join("\n");
			return `${friend}:\n${eventsString}`;
		});

		let gpt_string = `Given these events, find the most optimal time for these users to have a meeting on ${meetingDate} for 
		${meetingLength} so there is no conflicts with any of the events. 
		Think of these as one set of events. Convert time into PM or AM. 
		Explain why this is the best choice!`;
		let concatArray = [gpt_string, ...formattedEvents];
		const concatPrompt = concatArray.join(", ");
		askGPT(concatPrompt);
	};

	useEffect(() => {
		fetchFriendsEvents();
	}, []);

	return (
		<div>
			<h1>AI Schedule Suggestion</h1>
			{loading ? (
				<div>Loading AI Response...</div>
			) : (
				<div>{GPTResponse}</div>
			)}
		</div>
	);
};

export default AISchedule;
