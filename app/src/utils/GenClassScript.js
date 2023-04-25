const axios = require("axios");

let yaleCourses = {};

//Parse the pattern to remove HBTA, and change the real time/location nto a string or 'HBTA'
const parsePattern = (pattern) => {
	const res = pattern.filter((time) => !time.includes("HTBA"));
	return res[0] ? res[0].toString() : "HBTA";
};

// Parse the class schedule to exclude HBTA and change to a {days, start, end} format
function parseClassSchedule(classSchedule) {
	return classSchedule
		.filter((schedule) => !schedule.includes("HTBA"))
		.map((schedule) => {
			const [dayOfWeek, timeRange] = schedule.split(" ");
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

			return {
				days: dayOfWeek,
				start: startTime,
				end: endTime,
			};
		});
}

//Parse the days, so turning "TTh" -> ["Tuesday", "Thursday"]
function parseDays(schedule) {
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

	return schedule.map((event) => {
		return {
			days: daysMap[event.days],
			start: event.start,
			end: event.end,
		};
	});
}

//Create a FullCalander Event for every class
function mapScheduletoEvent(schedule) {
	const startDate = new Date("2023-01-17T00:00:00.000Z");
	const endDate = new Date("2023-04-28T23:59:59.999Z");
	const eventsList = [];

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

		for (const yclass of schedule) {
			if (yclass.days.includes(dayOfWeek)) {
				const startTime = new Date(
					`${d.toISOString().substring(0, 10)}T${yclass.start
						.toISOString()
						.substring(11, 23)}`
				);
				startTime.setUTCHours(
					yclass.start.getUTCHours(),
					yclass.start.getUTCMinutes(),
					yclass.start.getUTCSeconds()
				);

				const endTime = new Date(
					`${d.toISOString().substring(0, 10)}T${yclass.end
						.toISOString()
						.substring(11, 23)}`
				);
				endTime.setUTCHours(
					yclass.end.getUTCHours(),
					yclass.end.getUTCMinutes(),
					yclass.end.getUTCSeconds()
				);

				eventsList.push({ start: startTime, end: endTime });
			}
		}
	}

	return eventsList;
}

async function fetchCourses() {
	const subjectCodes = ["CHEM"];
	const termCode = "202301";
	const apiKey = process.env.REACT_APP_YALE_DEV_API_KEY;

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
	for (const subjectCode in yaleCourses) {
		const courses = yaleCourses[subjectCode];

		for (const course of courses) {
			try {
				// store the course in our database
				const courseResponse = await axios.post(
					`${process.env.REACT_APP_SERVER_API_URL}yclasses/create`,
					{
						className: course.subjectNumber,
						displayName: `${course.department} ${course.courseNumber} ${course.sectionNumber}`,
						classTitle: course.courseTitle,
						sectionNumber: course.sectionNumber,
						period: "202301",
						location: parsePattern(course.meetingPatternLocation),
						meetingTime: parsePattern(course.meetingPattern),
					}
				);

				// create events for each meeting pattern and add them to the course
				for (const classSchedule of mapScheduletoEvent(
					parseDays(parseClassSchedule(course.meetingPattern))
				)) {
					// create the yClassEvent
					const eventResponse = await axios.post(
						`${process.env.REACT_APP_SERVER_API_URL}yclassevents/create`,
						{
							class: courseResponse.data,
							title: `${course.department} ${course.courseNumber} ${course.sectionNumber}`,
							class: courseResponse.data,
							start: classSchedule.start,
							end: classSchedule.end,
						}
					);

					//  add the event to the class schedule
					await axios.put(
						`${process.env.REACT_APP_SERVER_API_URL}yclasses/${courseResponse.data._id}/schedule`,
						{
							eventId: eventResponse.data._id,
							action: "add",
						}
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

async function runScript() {
	await fetchCourses();
	console.log("Finished fetching courses");

	await addCoursesToDatabase();
	console.log("Courses and schedule added to database.");
}

runScript();
