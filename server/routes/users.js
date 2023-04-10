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
} from "../controllers/users.js";

const router = express.Router();

router.get("/:userId", getUserById);
router.get("/:email/email", getUserByEmail);
router.get("/:userId/friends", getUserFriends);
router.get("/:userId/events", getUserEvents);
router.get("/:userId/classes", getUserClasses);

router.put("/:userId/friends", updateUserFriends);
router.put("/:userId/events", updateUserEvents);
router.put("/:userId/classes", updateUserClasses);

export default router;
