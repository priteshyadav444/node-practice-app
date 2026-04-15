import { Task } from "../models/index.js";

export const createTask = async (data) => {
    const task = await Task.create(data);
    return task;
}

export const getTaskById = async (taskId) => {
    const task = await Task.findOne({ where: { id: taskId } })
    const taskData = task.get({ plain: true });
    return taskData;
}


export const getTasks = async () => {
    const tasks = await Task.findAll()
    return tasks;
}

export const updateTask = async (taskId, data) => {
    const task = await Task.update(data, { where: { id: taskId } });
    if(!task){
        throw new Error("Unable to update task");
    }
    return getTaskById(taskId);
}