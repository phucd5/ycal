import Event from "../models/Event.js";
import {
  handleNotFound,
  handleServerError,
  handleSuccess,
} from "../utils/query_response.js";

export const createEvent = async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    const savedEvent = await newEvent.save();
    handleSuccess(res, savedEvent);
  } catch (err) {
    handleServerError(res, err);
  }
};

export const getEventById = async (req, res) => {
  const { id } = req.params;
  try {
    const event = await Event.findById(id);

    if (!event) {
      return handleNotFound(res, "Event not found");
    }
    handleSuccess(res, event);
  } catch (err) {
    handleServerError(res, err);
  }
};

export const updateEventById = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    start,
    end,
    location,
    attendees,
    location_marker,
  } = req.body;
  try {
    const updateFields = {};
    if (title) updateFields.name = name;
    if (description) updateFields.description = description;
    if (start) updateFields.start_date = start_date;
    if (end) updateFields.end_date = end_date;
    if (location) updateFields.location = location;
    if (attendees) updateFields.attendees = attendees;
    if (location_marker) updateFields.location_marker = location_marker;
    updateFields.updatedAt = Date.now();

    const event = await Event.findByIdAndUpdate(id, updateFields, {
      new: true,
    });

    if (!event) {
      return handleNotFound(res, "Event not found");
    }

    handleSuccess(res, event);
  } catch (err) {
    handleServerError(res, err);
  }
};
