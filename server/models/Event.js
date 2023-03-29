import mongoose from "mongoose";

const EventSchema = mongoose.Schema({
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  attendees: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    default: [],
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
    default: "N/A",
  },
  start_date: {
    type: Date,
    required: true,
  },
  end_date: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: false,
    default: "N/A",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Event = mongoose.model("Event", EventSchema);
export default Event;
