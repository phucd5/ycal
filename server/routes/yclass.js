import express from "express";
import {
	createYClass,
	getYClassById,
	getYClassByName,
	getYClassSchedule,
	updateYClassSchedule,
	updateYClassById,
} from "../controllers/yclass.js";

const router = express.Router();

router.post("/create", createYClass);

router.get("/:classId", getYClassById);
router.get("/:className/name", getYClassByName);
router.get("/:classId/schedule", getYClassSchedule);

router.put("/:classId/schedule", updateYClassSchedule);
router.put("/:classId", updateYClassById);

export default router;
