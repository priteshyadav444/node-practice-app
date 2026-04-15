import express from "express";
import * as taskController from "../controllers/taskController.js";
import { validate } from "../middleware/validate.js";
import createTaskRule from "../middleware/validation/task/create.js";
import getTaskById from "../middleware/validation/task/getTaskById.js";

const router = express.Router();
router.post("/", createTaskRule, validate, taskController.createTask)
router.get('/:id', getTaskById, validate, taskController.getTaskById)
router.get('/', taskController.getTasks)


export default router;