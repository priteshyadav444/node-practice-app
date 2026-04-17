import express from "express";
import * as taskController from "../controllers/web/taskController.js";
import methodOverride from "method-override";

const webRoutes = express.Router();
webRoutes.use(methodOverride('_method'));

// EJS views
webRoutes.get("/", taskController.renderTasks);
webRoutes.get("/new", taskController.renderNewTask);
webRoutes.get("/:id/edit", taskController.renderEditTask);
webRoutes.get("/:id", taskController.renderShowTask);

export default webRoutes;