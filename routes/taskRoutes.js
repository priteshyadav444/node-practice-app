import express from "express";
import * as taskController from "../controllers/taskController.js";
import { validate } from "../middleware/validate.js";
import { updateTaskRule, createTaskRule } from "../middleware/validation/task/createUpdateTaskRule.js";
import getTaskById from "../middleware/validation/task/getTaskById.js";

const router = express.Router();
router.post('/', createTaskRule, validate(), taskController.createTask)
router.put('/:id', updateTaskRule, validate(), taskController.updateTask)
router.get('/:id', getTaskById, validate(), taskController.getTaskById)
router.delete('/:id', getTaskById, validate(true), taskController.deleteTask)
router.get('/', taskController.getTasks)


export default router;