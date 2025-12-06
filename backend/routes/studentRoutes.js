import express from "express";
import * as studentController from "../controllers/studentController.js";

const router = express.Router();

router.get("/", studentController.getAllStudents);
router.get("/room/:roomId", studentController.getStudentsByRoomId);
router.get("/building/:buildingId", studentController.getStudentsByBuildingId);

export default router;
