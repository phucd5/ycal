import express from "express";
import {
  createEvent,
  getEventById,
  updateEventById,
} from "../controllers/events.js";
import { verifyAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/", verifyAuth, createEvent);
router.get("/:id", verifyAuth, getEventById);
router.put("/:id", verifyAuth, updateEventById);

export default router;
