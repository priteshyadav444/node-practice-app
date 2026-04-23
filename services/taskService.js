import { Op } from "sequelize";
import { Task } from "../models/index.js";
import * as cacheService from "./cacheService.js";
import * as fileService from "./fileService.js";

export const createTask = async (data) => {
    const task = await Task.create(data);
    // Invalidate cached task lists
    cacheService.delByPrefix('tasks:');
    return task;
}

export const getTaskById = async (taskId) => {
    const task = await Task.findOne({ where: { id: taskId } })
    const taskData = task.get({ plain: true });
    return taskData;
}


export const getTasks = async (currentUserId) => {
    const cacheKey = `tasks:${currentUserId || 'all'}`;
    const cached = cacheService.get(cacheKey);
    if (cached) return cached;

    const tasks = await Task.findAll({
        where: {
            [Op.or]: [
                { assignedTo: currentUserId },
                { userId: currentUserId }
            ],
        }
    });
    const plain = tasks.map(t => (typeof t.get === 'function' ? t.get({ plain: true }) : t));
    cacheService.set(cacheKey, plain);
    return plain;
}

export const updateTask = async (taskId, data) => {
    data.version = parseInt(data.version) + 1;
    const task = await Task.update(data, { where: { id: taskId } });
    if (!task) {
        throw new Error("Unable to update task");
    }
    // Invalidate cached task lists
    cacheService.delByPrefix('tasks:');
    return getTaskById(taskId);
}

export const updateAssignToTask = async (taskId, data) => {
    const task = await Task.update(data, { where: { id: taskId } });
    if (!task) {
        throw new Error("Unable to assign task");
    }
    
    cacheService.delByPrefix('tasks:');
    return getTaskById(taskId);
}

export const deleteTask = async (taskId) => {
    // delete files from disk (best-effort)
    try { await fileService.deleteFilesForTask(taskId); } catch (e) {}
    const isSuccess = await Task.update({ deletedAt: Date.now() }, { where: { id: taskId } });
    if (!isSuccess) {
        throw new Error("Unable to delete task", isSuccess);
    }
    // Invalidate cached task lists
    cacheService.delByPrefix('tasks:');
    return isSuccess;
}