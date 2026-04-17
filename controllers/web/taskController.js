import { sendResponse, sendServerError } from "../../utils/responseHelper.js";
import * as taskService from "../../services/taskService.js";

// Render all tasks
export const renderTasks = async (req, res) => {
    try {
        const tasks = await taskService.getTasks();
        res.render("tasks/index", { tasks });
    } catch (error) {
        sendServerError(res, error);
    }
};

// Render new task form
export const renderNewTask = (req, res) => {
    res.render("tasks/new");
};

// Render edit task form
export const renderEditTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await taskService.getTaskById(id);
        res.render("tasks/edit", { task });
    } catch (error) {
        sendServerError(res, error);
    }
};

// Render single task
export const renderShowTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await taskService.getTaskById(id);
        res.render("tasks/show", { task });
    } catch (error) {
        sendServerError(res, error);
    }
};