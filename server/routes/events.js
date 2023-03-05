import express from "express";
import {
  createEvent,
  getEventById,
  updateEventById,
} from "../controllers/events";
import { verifyAuth } from "../middleware/auth";

const router = express.Router();

router.post("/", verifyAuth, createEvent);
router.get("/:id", verifyAuth, getEventById);
router.put("/:id", verifyAuth, updateEventById);

export default router;
