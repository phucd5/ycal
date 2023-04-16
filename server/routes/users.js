import express from "express";
import {
	getUserById,
	getUserEvents,
	getUserFriends,
	updateUserEvents,
	updateUserFriends,
	getUserByEmail,
	getUserClasses,
	updateUserClasses,
	getUserFriendRequests,
	updateUserFriendRequests,
} from "../controllers/users.js";

const router = express.Router();

router.get("/:userId", getUserById);
router.get("/:email/email", getUserByEmail);
router.get("/:userId/friends", getUserFriends);
router.get("/:userId/events", getUserEvents);
router.get("/:userId/classes", getUserClasses);
router.get("/:userId/friendrequests", getUserFriendRequests);

router.put("/:userId/friends", updateUserFriends);
router.put("/:userId/events", updateUserEvents);
router.put("/:userId/classes", updateUserClasses);
router.put("/:userId/friendrequests", updateUserFriendRequests);

export default router;
