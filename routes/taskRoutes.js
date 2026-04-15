import express from "express";
import * as taskController from "../controllers/taskController.js";
import { validate } from "../middleware/validate.js";
import createTaskRule from "../middleware/validation/task/create.js";

const router = express.Router();
router.post("/", createTaskRule, validate, taskController.createTask)
export default router;