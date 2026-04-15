import { Task } from "../models/index.js";

export const createTask = async (data) => {
    const task = await Task.create(data);
    return task;
}