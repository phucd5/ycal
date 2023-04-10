import express from "express";

import {
	createYClassEvent,
	getYClassEventById,
	updateEventById,
} from "../controllers/yclassevents.js";

const router = express.Router();

router.post("/create", createYClassEvent);
router.get("/:id", getYClassEventById);
router.put("/:id", updateEventById);

export default router;

//64332d29aa6960acd774b8aa
//64332e6780e4659e1db8cdb8
