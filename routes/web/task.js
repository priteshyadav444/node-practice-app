import express from "express";
import * as taskController from "../../controllers/web/taskController.js";
import methodOverride from "method-override";
import { assignTaskRule, createTaskRule, updateTaskRule } from "../../middleware/validation/task/index.js";
import upload from "../../middleware/upload.js";
import auth from "../../middleware/auth.js";

const webRoutes = express.Router();
webRoutes.use(methodOverride('_method'));

// EJS views
webRoutes.get("/", auth, taskController.renderTasks);
webRoutes.get("/new", auth, taskController.renderNewTask);
webRoutes.post("/", auth, upload.array('attachments'), createTaskRule, taskController.createTask);
webRoutes.get("/:id/edit", auth, taskController.renderEditTask);
webRoutes.get("/:id/assign", auth, taskController.renderAssignTask);
webRoutes.put("/:id/assign", auth, assignTaskRule, taskController.assignToTask);
webRoutes.get("/:id/edit", auth, taskController.renderEditTask);
webRoutes.put("/:id", auth, upload.array('attachments'), updateTaskRule, taskController.updateTask);
webRoutes.delete("/:id", auth,  taskController.deleteTask);
webRoutes.get("/:id", auth, taskController.renderShowTask);

export default webRoutes;