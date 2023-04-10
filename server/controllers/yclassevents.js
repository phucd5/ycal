import YClassEvent from "../models/YClassEvent.js";
import {
	handleNotFound,
	handleServerError,
	handleSuccess,
} from "../utils/query_response.js";

export const createYClassEvent = async (req, res) => {
	try {
		const newEvent = new YClassEvent(req.body);
		const savedEvent = await newEvent.save();
		handleSuccess(res, savedEvent);
	} catch (err) {
		handleServerError(res, err);
	}
};

export const getYClassEventById = async (req, res) => {
	const { id } = req.params;
	try {
		const event = await YClassEvent.findById(id);

		if (!event) {
			return handleNotFound(res, "YClass Event not found");
		}
		handleSuccess(res, event);
	} catch (err) {
		handleServerError(res, err);
	}
};

export const updateEventById = async (req, res) => {
	const { id } = req.params;
	const { className, color, start, end, location_marker, location } =
		req.body;
	try {
		const updateFields = {};
		if (className) updateFields.className = className;
		if (color) updateFields.color = color;
		if (start) updateFields.start = color;
		if (end) updateFields.end = end;
		if (location_marker) updateFields.location_marker = location_marker;
		if (location) updateFields.location = location;
		updateFields.updatedAt = Date.now();

		const event = await YClassEvent.findByIdAndUpdate(id, updateFields, {
			new: true,
		});

		if (!event) {
			return handleNotFound(res, "YClass Event not found");
		}

		handleSuccess(res, event);
	} catch (err) {
		handleServerError(res, err);
	}
};
