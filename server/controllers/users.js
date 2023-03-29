import User from "../models/User.js";
import Event from "../models/Event.js";
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
  console.log("Test");
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
        return handleBadRequest(res, "Friend is already in user's friend list");
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
    handleSuccess(res, user.friends);
  } catch (err) {
    handleServerError(res, err);
  }
};

export const getUserEvents = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate("events");

    if (!user) {
      return handleNotFound(res, "User not found");
    }

    handleSuccess(res, user.events);
  } catch (err) {
    handleServerError(res, err);
  }
};

export const updateUserEvents = async (req, res) => {
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
        return handleBadRequest(res, "Event is already in user's events list");
      }
      user.events.push(eventId);
    } else if (action === "remove") {
      user.events.remove(eventId);
    }
    await user.save();
    handleSuccess(res, user.events);
  } catch (err) {
    handleServerError(res, err);
  }
};
