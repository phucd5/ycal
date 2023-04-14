const axios = require("axios");

function parseMeetingPattern(meetingPattern) {
	const meetingDays = ["M", "T", "W", "Th", "F", "Sa", "Su"];
	const meetings = [];

	for (let i = 0; i < meetingPattern.length; i++) {
		const pattern = meetingPattern[i];

		if (!pattern.includes("HTBA")) {
			const [dayOfWeek, timeRange, location] = pattern.split(" ");
			const [startHour, startMinute] = timeRange.split("-")[0].split(".");
			const [endHour, endMinute] = timeRange.split("-")[1].split(".");
			const startTime = new Date();
			const endTime = new Date();

			startTime.setHours(
				Math.max(9, (startHour % 12) + (startHour >= 12 ? 12 : 0))
			);
			startTime.setMinutes(startMinute);

			endTime.setHours(
				Math.min(22, (endHour % 12) + (endHour >= 12 ? 12 : 0))
			);
			endTime.setMinutes(endMinute);

			meetings.push({
				days: dayOfWeek,
				start: startTime,
				end: endTime,
			});
		}
	}

	return meetings;
}

function mapDays(data) {
	const daysMap = {
		M: ["Monday"],
		T: ["Tuesday"],
		W: ["Wednesday"],
		Th: ["Thursday"],
		F: ["Friday"],
		MW: ["Monday", "Wednesday"],
		TTh: ["Tuesday", "Thursday"],
		"M-F": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
	};

	return data.map((item) => {
		return {
			days: daysMap[item.days],
			start: item.start,
			end: item.end,
		};
	});
}

function generateNewList(originalList) {
	const startDate = new Date("2023-01-17T00:00:00.000Z");
	const endDate = new Date("2023-04-28T23:59:59.999Z");
	const newList = [];

	for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
		const dayOfWeek = [
			"Sunday",
			"Monday",
			"Tuesday",
			"Wednesday",
			"Thursday",
			"Friday",
			"Saturday",
		][d.getDay()];

		for (let i = 0; i < originalList.length; i++) {
			if (originalList[i].days.includes(dayOfWeek)) {
				const startTime = new Date(
					d.toISOString().substring(0, 10) +
						"T" +
						originalList[i].start.toISOString().substring(11, 23)
				);
				startTime.setUTCHours(originalList[i].start.getUTCHours());
				startTime.setUTCMinutes(originalList[i].start.getUTCMinutes());
				startTime.setUTCSeconds(originalList[i].start.getUTCSeconds());

				const endTime = new Date(
					d.toISOString().substring(0, 10) +
						"T" +
						originalList[i].end.toISOString().substring(11, 23)
				);
				endTime.setUTCHours(originalList[i].end.getUTCHours());
				endTime.setUTCMinutes(originalList[i].end.getUTCMinutes());
				endTime.setUTCSeconds(originalList[i].end.getUTCSeconds());

				newList.push({
					start: startTime,
					end: endTime,
				});
			}
		}
	}

	return newList;
}

let yaleCourses = {};

async function fetchCourses() {
	const subjectCodes = ["CPSC"];
	const termCode = "202203";
	const apiKey = "l757ed321eec474c04827ac3fc0f128df8";

	try {
		for (const subjectCode of subjectCodes) {
			const url = `https://gw.its.yale.edu/soa-gateway/courses/webservice/v3/index?apikey=${apiKey}&subjectCode=${subjectCode}&termCode=${termCode}`;
			const response = await axios.get(url);
			yaleCourses[subjectCode] = response.data;
		}
	} catch (err) {
		console.error(err);
	}
}

async function addCoursesToDatabase() {
	const courseApiEndpoint = "http://localhost:3002/yclasses/create";
	const eventApiEndpoint = "http://localhost:3002/yclassevents/create";
	const scheduleApiEndpoint =
		"http://localhost:3002/yclasses/:classId/schedule";

	for (const subjectCode in yaleCourses) {
		const courses = yaleCourses[subjectCode];

		for (const course of courses) {
			try {
				// create the course
				const courseResponse = await axios.post(
					"http://localhost:3002/yclasses/create",
					{
						className: course.subjectNumber,
					}
				);

				// create events for each meeting pattern and associate them with the course
				for (const meeting of generateNewList(
					mapDays(parseMeetingPattern(course.meetingPattern))
				)) {
					const event = {
						start: meeting.start,
						end: meeting.end,
					};

					// create the event
					const eventResponse = await axios.post(
						"http://localhost:3002/yclassevents/create",
						event
					);

					// associate the event with the course
					const scheduleBody = {
						eventId: eventResponse.data._id,
						action: "add",
					};
					await axios.put(
						`http://localhost:3002/yclasses/${courseResponse.data._id}/schedule`,
						scheduleBody
					);

					console.log(
						`Added event ${eventResponse.data._id} to course ${courseResponse.data._id}.`
					);
				}

				console.log(
					`Added course ${courseResponse.data._id} to database.`
				);
			} catch (err) {
				console.error(
					`Failed to add course ${course.subjectNumber} to database:`,
					err
				);
			}
		}
	}
}

async function printYaleCourses() {
	await fetchCourses();
	console.log("Yale courses data:", yaleCourses);

	await addCoursesToDatabase();
	console.log("Courses and events added to database.");
}

printYaleCourses();

// async function printYaleCourses() {
// 	await fetchCourses();
// 	await addCoursesToDatabase();
// 	console.log("Courses added to database.");
// }

// printYaleCourses();

// const new_obj = generateNewList(mapDays(parseMeetingPattern(meetingPattern)));
// console.log(new_obj);

// const newList = generateNewList(new_obj, startDate, endDate);
// console.log(newList);
