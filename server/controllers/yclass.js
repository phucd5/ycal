import YClass from "../models/YClass.js";
import YClassEvent from "../models/YClassEvent.js";
import {
	handleNotFound,
	handleServerError,
	handleSuccess,
} from "../utils/query_response.js";

export const createYClass = async (req, res) => {
	try {
		const newYClass = new YClass(req.body);
		const savedYClass = await newYClass.save();
		handleSuccess(res, savedYClass);
	} catch (err) {
		handleServerError(res, err);
	}
};

export const getYClassById = async (req, res) => {
	const { classId } = req.params;
	try {
		const YClassResponse = await YClass.findById(classId);

		if (!YClassResponse) {
			return handleNotFound(res, "YClass not found");
		}
		handleSuccess(res, YClassResponse);
	} catch (err) {
		handleServerError(res, err);
	}
};

export const getYClassByName = async (req, res) => {
	const searchTerm = req.params.className;
	console.log(searchTerm);
	try {
		const YClassResponse = await YClass.find({
			$text: { $search: searchTerm, $caseSensitive: false },
		});
		if (!YClassResponse.length) {
			return handleNotFound(res, "No classes found matching class name");
		}

		handleSuccess(res, YClassResponse);
	} catch (err) {
		handleServerError(res, err);
	}
};

// export const getYClassByName = async (req, res) => {
// 	try {
// 		const YClassResponse = await YClass.findOne({
// 			displayName: req.params.className,
// 		});
// 		if (!YClassResponse) {
// 			return handleNotFound(res, "Class not found");
// 		}
// 		handleSuccess(res, YClassResponse);
// 	} catch (err) {
// 		res.status(500).json({ message: err.message });
// 	}
// };

export const getYClassSchedule = async (req, res) => {
	try {
		const YClassResponse = await YClass.findById(
			req.params.classId
		).populate("schedule");

		if (!YClassResponse) {
			return handleNotFound(res, "Class not found");
		}

		handleSuccess(res, YClassResponse.schedule);
	} catch (err) {
		handleServerError(res, err);
	}
};

export const updateYClassSchedule = async (req, res) => {
	const { classId } = req.params;
	const { eventId, action } = req.body;
	try {
		const YClassResponse = await YClass.findById(classId);
		const event = await YClassEvent.findById(eventId);

		if (!YClassResponse) {
			return handleNotFound(res, "User not found");
		} else if (!event) {
			return handleNotFound(res, "Event not found");
		}
		if (action === "add") {
			if (YClassResponse.schedule.includes(eventId)) {
				return handleBadRequest(
					res,
					"Event is already in user's events list"
				);
			}
			YClassResponse.schedule.push(eventId);
		} else if (action === "remove") {
			YClassResponse.schedule.remove(eventId);
		}

		await YClassResponse.save();
		handleSuccess(res, YClassResponse.schedule);
	} catch (err) {
		handleServerError(res, err);
	}
};

export const updateYClassById = async (req, res) => {
	const { classId } = req.params;
	const {
		className,
		classTitle,
		displayName,
		sectionNumber,
		cSectionStatus,
		sectionStatus,
		shortTitle,
		time,
		location,
		period,
	} = req.body;

	try {
		const updateFields = {};
		if (displayName) updateFields.displayName = displayName;
		if (className) updateFields.className = className;
		if (sectionNumber) updateFields.sectionNumber = sectionNumber;
		if (cSectionStatus) updateFields.cSectionStatus = cSectionStatus;
		if (sectionStatus) updateFields.sectionStatus = sectionStatus;
		if (shortTitle) updateFields.shortTitle = shortTitle;
		if (time) updateFields.time = time;
		if (location) updateFields.location = location;
		if (period) updateFields.period = period;
		if (classTitle) updateFields.classTitle = classTitle;
		updateFields.updatedAt = Date.now();

		const YClassResponse = await YClass.findByIdAndUpdate(
			classId,
			updateFields,
			{
				new: true,
			}
		);

		if (!YClassResponse) {
			return handleNotFound(res, "Event not found");
		}

		handleSuccess(res, YClassResponse);
	} catch (err) {
		handleServerError(res, err);
	}
};
