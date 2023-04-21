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
		required: true,
	},
	period: {
		type: String,
		required: true,
	},
	meetingTime: {
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

YClassSchema.index({ displayName: "text" });
const YClass = mongoose.model("YClass", YClassSchema);
export default YClass;
