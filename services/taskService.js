import { Op } from "sequelize";
import { Task } from "../models/index.js";
import { getCurrentUserId } from "../utils/sessionHelper.js";

export const createTask = async (data) => {
    const task = await Task.create(data);
    return task;
}

export const getTaskById = async (taskId) => {
    const task = await Task.findOne({ where: { id: taskId } })
    const taskData = task.get({ plain: true });
    return taskData;
}


export const getTasks = async (currentUserId) => {
    const tasks = await Task.findAll({
        where: {
            [Op.or]: [
                { assignedTo: currentUserId },
                { userId: currentUserId }
            ],
        }
    })
    return tasks;
}

export const updateTask = async (taskId, data) => {
    data.version = parseInt(data.version) + 1;
    const task = await Task.update(data, { where: { id: taskId } });
    if (!task) {
        throw new Error("Unable to update task");
    }
    return getTaskById(taskId);
}

export const updateAssignToTask = async (taskId, data) => {
    const task = await Task.update(data, { where: { id: taskId } });
    if (!task) {
        throw new Error("Unable to assign task");
    }
    return getTaskById(taskId);
}

export const deleteTask = async (taskId) => {
    const isSuccess = await Task.update({
        deletedAt: Date.now()
    }, { where: { id: taskId } });
    if (!isSuccess) {
        throw new Error("Unable to delete task", isSuccess);
    }
    return isSuccess;
}