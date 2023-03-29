import express from "express";
import {
  createEvent,
  getEventById,
  updateEventById,
} from "../controllers/events.js";

const router = express.Router();

router.post("/create", createEvent);
router.get("/:id", getEventById);
router.put("/:id", updateEventById);

export default router;
