import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: true,
	},
	lastName: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	friend_requests: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			default: [],
		},
	],
	friends: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			default: [],
		},
	],
	events: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Event",
			default: [],
		},
	],
	classes: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "YClass",
			default: [],
		},
	],
});

const User = mongoose.model("User", UserSchema);
export default User;
