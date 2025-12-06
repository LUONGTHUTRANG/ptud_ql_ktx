import express from "express";
import semesterRoutes from "./semesterRoutes.js";
import buildingRoutes from "./buildingRoutes.js";
import managerRoutes from "./managerRoutes.js";
import roomRoutes from "./roomRoutes.js";
import invoiceRoutes from "./invoiceRoutes.js";
import studentRoutes from "./studentRoutes.js";

const router = express.Router();

router.use("/semesters", semesterRoutes);
router.use("/buildings", buildingRoutes);
router.use("/managers", managerRoutes);
router.use("/rooms", roomRoutes);
router.use("/invoices", invoiceRoutes);
router.use("/students", studentRoutes);

export default router;
