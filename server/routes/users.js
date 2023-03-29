import express from "express";
import {
  getUserById,
  getUserEvents,
  getUserFriends,
  updateUserEvents,
  updateUserFriends,
} from "../controllers/users.js";

const router = express.Router();

router.get("/:userId", getUserById);
router.get("/:userId/friends", getUserFriends);
router.get("/:userId/events", getUserEvents);

router.put("/:userId/friends", updateUserFriends);
router.put("/:userId/events", updateUserEvents);

export default router;
