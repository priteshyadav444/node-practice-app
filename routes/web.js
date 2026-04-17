import express from "express";
import * as taskController from "../controllers/web/taskController.js";
import methodOverride from "method-override";
import { createTaskRule, updateTaskRule } from "../middleware/validation/task/index.js";

const webRoutes = express.Router();
webRoutes.use(methodOverride('_method'));

// EJS views
webRoutes.get("/", taskController.renderTasks);
webRoutes.get("/new", taskController.renderNewTask);
webRoutes.post("/", createTaskRule, taskController.createTask);
webRoutes.get("/:id/edit", taskController.renderEditTask);
webRoutes.put("/:id", updateTaskRule, taskController.updateTask);
webRoutes.delete("/:id", taskController.deleteTask);
webRoutes.get("/:id", taskController.renderShowTask);

export default webRoutes;