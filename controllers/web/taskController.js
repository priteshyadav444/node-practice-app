import { sendServerError } from "../../utils/responseHelper.js";
import * as taskService from "../../services/taskService.js";
import { validationResult, matchedData } from "express-validator";
import { User } from "../../models/index.js";
import { Op } from 'sequelize';
import { getCurrentUser, getCurrentUserId } from "../../utils/sessionHelper.js";

// Render all tasks
export const renderTasks = async (req, res) => {
    try {
        const tasks = await taskService.getTasks();
        res.render("tasks/index", { tasks });
    } catch (error) {
        sendServerError(res, error);
    }
};

export async function getAssignedToUserList(req) {
    const currentUserId = getCurrentUserId(req);
    const where = { isActive: true };
    if (currentUserId) where.id = { [Op.ne]: currentUserId };
    const users = await User.findAll({ where });
    return users ? users : [];
}

// Render new task form
export const renderNewTask = async (req, res) => {
    try {
        const users = await getAssignedToUserList(req);
        res.render("tasks/new", { errors: null, old: {}, users });
    } catch (error) {
        sendServerError(res, error);
    }
};

// Handle create from form
export const createTask = async (req, res) => {
    try {
        const errors = validationResult(req);
        const old = req.body;
        const users = await User.findAll({ where: { isActive: true } });
        if (!errors.isEmpty()) {
            return res.status(422).render("tasks/new", { errors: errors.array(), old, users });
        }
        const data = matchedData(req, { locations: ['body'] });
        await taskService.createTask(data);
        return res.redirect('/tasks');
    } catch (error) {
        sendServerError(res, error);
    }
};

// Render edit task form
export const renderEditTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await taskService.getTaskById(id);
        const users = await getAssignedToUserList(req);
        res.render("tasks/edit", { task, errors: null, old: {}, users });
    } catch (error) {
        sendServerError(res, error);
    }
};

// Handle update from form
export const updateTask = async (req, res) => {
    try {
        console.log('BODY:', req.body);
        console.log('FILES:', req.files);
        const errors = validationResult(req);
        const old = req.body;
        const { id } = req.params;
        const users = await User.findAll({ where: { isActive: true } });
        if (!errors.isEmpty()) {
            const task = await taskService.getTaskById(id);
            return res.status(422).render("tasks/edit", { task, errors: errors.array(), old, users });
        }
        const data = matchedData(req, { locations: ['body'] });
        await taskService.updateTask(id, data);
        return res.redirect('/tasks');
    } catch (error) {
        sendServerError(res, error);
    }
};

export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        await taskService.deleteTask(id);
        return res.redirect('/tasks');
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