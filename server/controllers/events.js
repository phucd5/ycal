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
  const { name, description, start_date, end_date, location } = req.body;
  try {
    const updateFields = {};
    if (name) updateFields.name = name;
    if (description) updateFields.description = description;
    if (start_date) updateFields.start_date = start_date;
    if (end_date) updateFields.end_date = end_date;
    if (location) updateFields.location = location;
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

//"6423c65a09ba2674f950300f"
