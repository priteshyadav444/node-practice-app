import { sendServerError, sendError } from "../../utils/responseHelper.js";
import * as taskService from "../../services/taskService.js";
import * as fileService from "../../services/fileService.js";
import { validationResult, matchedData } from "express-validator";
import { User } from "../../models/index.js";
import { Op } from 'sequelize';
import { getCurrentUser, getCurrentUserId, setFlashMessage } from "../../utils/sessionHelper.js";
import { hasPermission } from '../../utils/permissionHelper.js';

// Render all tasks
export const renderTasks = async (req, res) => {
    try {
        const currentUserId = getCurrentUserId(req);
        const tasks = await taskService.getTasks(currentUserId);
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
        if (!hasPermission(getCurrentUser(req), 'task:create')) return res.status(403).send('Forbidden');
        const users = await getAssignedToUserList(req);
        res.render("tasks/new", { errors: null, old: {}, users });
    } catch (error) {
        sendServerError(res, error);
    }
};

// Handle create from form
export const createTask = async (req, res) => {
    try {
        if (!hasPermission(getCurrentUser(req), 'task:create')) return res.status(403).send('Forbidden');
        const errors = validationResult(req);
        const old = req.body;
        const users = await User.findAll({ where: { isActive: true } });
        if (!errors.isEmpty()) {
            return res.status(422).render("tasks/new", { errors: errors.array(), old, users });
        }
        let data = matchedData(req, { locations: ['body'] });
        data.userId = getCurrentUserId(req);
        await taskService.createTask(data);
        return res.redirect('/tasks');
    } catch (error) {
        sendServerError(res, error);
    }
};

// Render edit task form
export const renderEditTask = async (req, res) => {
    try {
        if (!hasPermission(getCurrentUser(req), 'task:edit')) return res.status(403).send('Forbidden');
        const { id } = req.params;
        const task = await taskService.getTaskById(id);
        const users = await getAssignedToUserList(req);
        res.render("tasks/edit", { task, errors: null, old: {}, users });
    } catch (error) {
        sendServerError(res, error);
    }
};

export const renderAssignTask = async (req, res) => {
    try {
        if (!hasPermission(getCurrentUser(req), 'task:assign')) return res.status(403).send('Forbidden');
        const { id } = req.params;
        const task = await taskService.getTaskById(id);
        const users = await getAssignedToUserList(req);
        res.render("tasks/assign", { task, errors: null, old: {}, users });
    } catch (error) {
        sendServerError(res, error);
    }
};

export const assignToTask = async (req, res) => {
    try {
        const { id } = req.params;
        if (!hasPermission(getCurrentUser(req), 'task:assign')) return res.status(403).send('Forbidden');
        const errors = validationResult(req);
        const old = req.body;
        const data = matchedData(req, { locations: ['body'] });
        if (!errors.isEmpty()) {
            const task = await taskService.getTaskById(id);
            const users = await getAssignedToUserList(req);
            res.render("tasks/assign", { task, errors, old, users });
        }
        await taskService.updateAssignToTask(id, data);
        setFlashMessage(req, "Task assigned successfully");
        res.redirect(`/tasks/${id}/assign`);
    } catch (error) {
        console.log(error); ``
        sendServerError(res, error);
    }
}

// Handle update from form
export const updateTask = async (req, res) => {
    try {
        if (!hasPermission(getCurrentUser(req), 'task:edit')) return res.status(403).send('Forbidden');
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
        if (!hasPermission(getCurrentUser(req), 'task:delete')) return res.status(403).send('Forbidden');
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

export const downloadTaskFile = async (req, res) => {
    try {
        const { id: taskId, fileId } = req.params;
        const file = await (await import('../../services/taskFileService.js')).getTaskFile(taskId, fileId);
        const mime = file.mimetype || 'application/octet-stream';
        res.setHeader('Content-Type', mime);
        res.setHeader('Content-Disposition', `inline; filename="${file.originalname.replace(/\"/g,'') }"`);
        return res.sendFile(file.path);
    } catch (error) {
        return sendServerError(res, error);
    }
};

export const deleteTaskFile = async (req, res) => {
    try {
        const { id: taskId, fileId } = req.params;
        if (!hasPermission(getCurrentUser(req), 'task:edit')) return res.status(403).send('Forbidden');
        const fileService = await import('../../services/fileService.js');
        await fileService.deleteSingleFile(taskId, fileId);
        return res.redirect(`/tasks/${taskId}/edit`);
    } catch (error) {
        return sendServerError(res, error);
    }
};

// Handle multiple file uploads from task details page
export const uploadTaskFiles = async (req, res) => {
    try {
        const { id } = req.params;
        if (!hasPermission(getCurrentUser(req), 'task:edit')) return res.status(403).send('Forbidden');

        if (!req.files || req.files.length === 0) {
            setFlashMessage(req, 'No files uploaded');
            return res.redirect(`/tasks/${id}`);
        }

        try {
            await fileService.saveFilesToTask(id, req.files);
            setFlashMessage(req, 'Files uploaded successfully');
            return res.redirect(`/tasks/${id}`);
        } catch (e) {
            return sendServerError(res, e);
        }
    } catch (error) {
        return sendServerError(res, error);
    }
};