import mongoose from "mongoose";

const YClassSchema = new mongoose.Schema({
	className: {
		type: String,
		required: true,
	},
	classTitle: {
		type: String,
		required: true,
	},
	displayName: {
		type: String,
		required: true,
	},
	sectionNumber: {
		type: String,
		required: true,
	},
	location: {
		type: String,
		required: false,
	},
	period: {
		type: String,
		required: true,
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
