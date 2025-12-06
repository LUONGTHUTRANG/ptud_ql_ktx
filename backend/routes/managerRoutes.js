import express from "express";
import * as managerController from "../controllers/managerController.js";

const router = express.Router();

router.get("/", managerController.getAllManagers);
router.get("/:id", managerController.getManagerById);
router.post("/", managerController.createManager);
router.put("/:id", managerController.updateManager);
router.delete("/:id", managerController.deleteManager);

export default router;
