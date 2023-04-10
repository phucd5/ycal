import mongoose from "mongoose";

const YClassSchema = new mongoose.Schema({
	className: {
		type: String,
		required: true,
	},
	classTitle: {
		type: String,
		required: false,
	},
	sectionNumber: {
		type: String,
		required: false,
	},
	cSectionStatus: {
		type: String,
		required: false,
	},
	sectionStatus: {
		type: String,
		required: false,
	},
	time: {
		type: String,
		required: false,
	},
	location: {
		type: String,
		required: false,
	},
	period: {
		type: String,
		required: false,
	},
	schedule: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "YClassEvent",
			default: [],
		},
	],
});

const YClass = mongoose.model("YClass", YClassSchema);
export default YClass;
