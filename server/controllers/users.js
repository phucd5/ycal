import User from "../models/User.js";
import Event from "../models/Event.js";
import YClass from "../models/YClass.js";
import {
	handleNotFound,
	handleServerError,
	handleSuccess,
	handleBadRequest,
} from "../utils/query_response.js";

export const getUserById = async (req, res) => {
	try {
		const user = await User.findById(req.params.userId);

		if (!user) {
			return handleNotFound(res, "User not found");
		}

		handleSuccess(res, user);
	} catch (err) {
		handleServerError(res, err);
	}
};

export const getUserFriends = async (req, res) => {
	try {
		const user = await User.findById(req.params.userId).populate("friends");

		if (!user) {
			return handleNotFound(res, "User not found");
		}

		handleSuccess(res, user.friends);
	} catch (err) {
		handleServerError(res, err);
	}
};

export const updateUserFriends = async (req, res) => {
	const { userId } = req.params;
	const { friendId, action } = req.body;

	try {
		if (userId == friendId) {
			return handleBadRequest("You can't friend yourself!");
		}

		const user = await User.findById(userId);
		const friend = await User.findById(friendId);

		if (!user) {
			return handleNotFound(res, "User not found");
		} else if (!friend) {
			return handleNotFound(res, "Friend not found");
		}

		if (action === "add") {
			if (user.friends.includes(friendId)) {
				return handleBadRequest(
					res,
					"Friend is already in user's friend list"
				);
			}
			user.friends.push(friendId);
			friend.friends.push(userId);
		} else if (action === "remove") {
			user.friends.remove(friendId);
			friend.friends.remove(userId);
		} else {
			return handleNotFound(res, "Invalid action");
		}

		await user.save();
		await friend.save();

		const updatedUser = await User.findById(userId).populate("friends");

		handleSuccess(res, updatedUser.friends);
	} catch (err) {
		handleServerError(res, err);
	}
};

export const getUserEvents = async (req, res) => {
	try {
		const user = await User.findById(req.params.userId).populate({
			path: "events",
			populate: { path: "attendees" },
		});

		if (!user) {
			return handleNotFound(res, "User not found");
		}

		handleSuccess(res, user.events);
	} catch (err) {
		handleServerError(res, err);
	}
};

export const updateUserEvents = async (req, res) => {
	console.log("addED");
	const { userId } = req.params;
	const { eventId, action } = req.body;
	try {
		const user = await User.findById(userId);
		const event = await Event.findById(eventId);

		if (!user) {
			return handleNotFound(res, "User not found");
		} else if (!event) {
			return handleNotFound(res, "Event not found");
		}
		if (action === "add") {
			if (user.events.includes(eventId)) {
				return handleBadRequest(
					res,
					"Event is already in user's events list"
				);
			}
			user.events.push(eventId);
			console.log("ADDED");
		} else if (action === "remove") {
			user.events.remove(eventId);
		}
		const events = await Promise.all(
			user.events.map((eventId) => Event.findById(eventId))
		);

		events.sort((a, b) => {
			const startDiff = new Date(a.start_date) - new Date(b.start_date);
			if (startDiff !== 0) {
				return startDiff;
			} else {
				return new Date(a.end_date) - new Date(b.end_date);
			}
		});
		user.events = events.map((event) => event._id);

		await user.save();
		handleSuccess(res, user.events);
	} catch (err) {
		handleServerError(res, err);
	}
};

export const getUserByEmail = async (req, res) => {
	try {
		const user = await User.findOne({ email: req.params.email });
		if (!user) {
			return handleNotFound(res, "User not found");
		}
		handleSuccess(res, user);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export const getUserClasses = async (req, res) => {
	try {
		const user = await User.findById(req.params.userId).populate("classes");

		if (!user) {
			return handleNotFound(res, "User not found");
		}

		handleSuccess(res, user.classes);
	} catch (err) {
		handleServerError(res, err);
	}
};

export const updateUserClasses = async (req, res) => {
	const { userId } = req.params;
	const { courseId, action } = req.body;
	try {
		const user = await User.findById(userId);
		const yclass = await YClass.findById(courseId);

		if (!user) {
			return handleNotFound(res, "User not found");
		} else if (!yclass) {
			return handleNotFound(res, "Class not found");
		}
		if (action === "add") {
			if (user.classes.includes(courseId)) {
				return handleBadRequest(
					res,
					"Event is already in user's events list"
				);
			}
			user.classes.push(courseId);
		} else if (action === "remove") {
			user.classes.remove(courseId);
		}
		await user.save();
		handleSuccess(res, user.classes);
	} catch (err) {
		handleServerError(res, err);
	}
};

export const getUserFriendRequests = async (req, res) => {
	try {
		const user = await User.findById(req.params.userId).populate(
			"friend_requests"
		);

		if (!user) {
			return handleNotFound(res, "User not found");
		}

		handleSuccess(res, user.friend_requests);
	} catch (err) {
		handleServerError(res, err);
	}
};

export const updateUserFriendRequests = async (req, res) => {
	const { userId } = req.params;
	const { friendId, action } = req.body;

	try {
		if (userId == friendId) {
			return handleBadRequest("You can't friend yourself!");
		}

		const user = await User.findById(userId);
		const friend = await User.findById(friendId);

		if (!user) {
			return handleNotFound(res, "User not found");
		} else if (!friend) {
			return handleNotFound(res, "Friend not found");
		}

		if (action === "add") {
			if (friend.friend_requests.includes(userId)) {
				return handleBadRequest(res, "Friend request already sent!");
			} else if (user.friends.includes(friendId)) {
				return handleBadRequest(
					res,
					"Friend is already in user's friend list"
				);
			}
			// user.friend_requests.push(friendId);
			friend.friend_requests.push(userId);
			//Remember to only have it one sided
		} else if (action === "remove") {
			// user.friend_requests.remove(friendId);
			user.friend_requests.remove(friendId);
		} else {
			return handleNotFound(res, "Invalid action");
		}

		await friend.save();
		await user.save();

		handleSuccess(res, friend.friend_requests);
	} catch (err) {
		handleServerError(res, err);
	}
};
