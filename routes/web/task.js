import express from "express";
import * as taskController from "../../controllers/web/taskController.js";
import methodOverride from "method-override";
import { assignTaskRule, createTaskRule, updateTaskRule } from "../../middleware/validation/task/index.js";
import auth from "../../middleware/auth.js";
import { handleMulterError } from "../../utils/responseHelper.js";

const webRoutes = express.Router();
webRoutes.use(methodOverride('_method'));

// EJS views
webRoutes.get("/", auth, taskController.renderTasks);
webRoutes.get("/new", auth, taskController.renderNewTask);
webRoutes.post("/", auth, handleMulterError('attachments'), createTaskRule, taskController.createTask);
webRoutes.get("/:id/edit", auth, taskController.renderEditTask);
// file download (preview) and delete for web UI
webRoutes.get('/:id/files/:fileId', auth, taskController.downloadTaskFile);
webRoutes.delete('/:id/files/:fileId', auth, taskController.deleteTaskFile);
webRoutes.get("/:id/assign", auth, taskController.renderAssignTask);
webRoutes.put("/:id/assign", auth, assignTaskRule, taskController.assignToTask);
webRoutes.get("/:id/edit", auth, taskController.renderEditTask);
webRoutes.put("/:id", auth, handleMulterError('attachments'), updateTaskRule, taskController.updateTask);
webRoutes.delete("/:id", auth,  taskController.deleteTask);
// upload attachments from task details view
webRoutes.post("/:id/files", auth, handleMulterError('attachments'), taskController.uploadTaskFiles);

webRoutes.get("/:id", auth, taskController.renderShowTask);

export default webRoutes;