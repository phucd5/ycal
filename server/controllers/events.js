import Event from "../models/Event.js";
import {
  handleNotFound,
  handleServerError,
  handleSuccess,
} from "../utils/query_response.js";

//Create a new event
export const createEvent = async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    const savedEvent = await newEvent.save();
    handleSuccess(res, savedEvent);
  } catch (err) {
    handleServerError(res, err);
  }
};

//Get an event by ID
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      "organizer",
      "name email"
    );
    if (!event) {
      handleNotFound(res);
    }
    handleSuccess(res, event);
  } catch (err) {
    handleServerError(res, err);
  }
};

//Update an event by ID
export const updateEventById = async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("organizer", "name email");
    if (!updatedEvent) {
      handleNotFound(res);
    }
    handleSuccess(res, updatedEvent);
  } catch (err) {
    handleServerError(res, err);
  }
};
