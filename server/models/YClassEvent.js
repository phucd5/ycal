import mongoose from "mongoose";

const YClassEventSchema = mongoose.Schema({
	class: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "YClass",
		required: true,
	},
	title: {
		type: String,
		required: true,
	},
	color: {
		type: String,
		required: false,
		default: "#90ee90",
	},
	start: {
		type: Date,
		required: true,
	},
	end: {
		type: Date,
		required: true,
	},
	location_marker: {
		type: String,
		required: false,
		default: "None",
	},
	location: {
		type: String,
		required: false,
		default: "",
	},
	isClass: {
		type: Boolean,
		required: false,
		default: true,
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

const YClassEvent = mongoose.model("YClassEvent", YClassEventSchema);
export default YClassEvent;
