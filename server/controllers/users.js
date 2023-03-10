import User from "../models/User.js";
import {
  handleNotFound,
  handleServerError,
  handleSuccess,
} from "../utils/query_response.js";

//GET

//Get a user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate("friends")
      .populate("events");
    if (!user) {
      return handleNotFound(res);
    }
    handleSuccess(res, user);
  } catch (error) {
    handleServerError(res, err);
  }
};

//Get a user's friend list
export const getUserFriends = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate("friends");
    if (!user) {
      return handleNotFound(res);
    }
    handleSuccess(res, user.friends);
  } catch (error) {
    handleServerError(res, err);
  }
};

//Get a user's events
// export const getUserEvents = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.userId).populate("events");
//     if (!user) {
//       return handleNotFound(res);
//     }
//     handleSuccess(res, user.events);
//   } catch (error) {
//     console.error(error);
//     handleServerError(res, err);
//   }
// };

export const getUserEvents = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate("events")
      .lean();
    if (!user) {
      return handleNotFound(res);
    }
    const events = user.events.map((event) => ({
      title: event.name,
      start: event.date,
      end: event.date,
    }));
    handleSuccess(res, events);
  } catch (error) {
    console.error(error);
    handleServerError(res, err);
  }
};

//PUT

//Add or remove a user's friend
export const updateUserFriends = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return handleNotFound(res);
    }
    if (req.query.add === "true") {
      user.friends.push(req.body.friendId);
    } else {
      user.friends.pull(req.body.friendId);
    }
    await user.save();
    handleSuccess(res, user.friends);
  } catch (error) {
    handleServerError(res, err);
  }
};

//Add or remove an event
export const updateUserEvents = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return handleNotFound(res);
    }
    if (req.body.add === true) {
      console.log("Added");
      user.events.push(req.body.eventId);
    } else {
      console.log("Removed");
      user.events.pull(req.body.eventId);
    }
    await user.save();
    handleSuccess(res, user.events);
  } catch (error) {
    handleServerError(res);
  }
};
