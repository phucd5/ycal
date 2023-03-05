import express from "express";
import {
  getUserById,
  getUserEvents,
  getUserFriends,
  updateUserEvents,
  updateUserFriends,
} from "../controllers/users";
import { verifyAuth } from "../middleware/auth";

const router = express.Router();

router.get("/:userId", verifyAuth, getUserById);
router.get("/:userId/friends", verifyAuth, getUserFriends);
router.get("/:userId/events", verifyAuth, getUserEvents);

router.put("/:userId/friends", verifyAuth, updateUserFriends);
router.put("/:userId/events", verifyAuth, updateUserEvents);

export default router;