
import express from "express";
import * as taskController from "../controllers/taskController.js";
import * as taskFileController from "../controllers/taskFileController.js";
import { validate } from "../middleware/validate.js";
import { updateTaskRule, createTaskRule, getTaskById, assignTaskRule } from "../middleware/validation/task/index.js";
import { uploadTaskFileRule, taskFileIdRule } from "../middleware/validation/task/fileRules.js";
import upload from "../middleware/upload.js";


const router = express.Router();
router.get('/:taskId/files/:fileId', taskFileIdRule, validate(), taskFileController.getTaskFile);

router.post('/', createTaskRule, validate(), taskController.createTask);
router.put('/:id', updateTaskRule, validate(), taskController.updateTask);
router.get('/:id', getTaskById, validate(), taskController.getTaskById);
router.delete('/:id', getTaskById, validate(true), taskController.deleteTask);
router.patch('/:id/assign', assignTaskRule, validate(false), taskController.updateTask);
router.get('/', taskController.getTasks);

// Task file upload/download/delete
router.post('/:id/upload', uploadTaskFileRule, validate(), upload.single('file'), taskFileController.uploadTaskFile);
router.delete('/:taskId/files/:fileId', taskFileIdRule, validate(), taskFileController.deleteTaskFile);


export default router;