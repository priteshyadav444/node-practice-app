import { Task } from "../models/index.js";
import fs from "fs";
import path from "path";
import * as cacheService from "./cacheService.js";
import * as fileService from "./fileService.js";

export const uploadTaskFile = async (taskId, file) => {
    // Delegate to common file service for transactional save
    const saved = await fileService.saveFilesToTask(taskId, [file]);
    cacheService.delByPrefix('tasks:');
    return saved[0];
};

export const getTaskFile = async (taskId, fileId) => {
    const task = await Task.findOne({ where: { id: taskId } });
    if (!task) throw new Error("Task not found");
    const attachments = Array.isArray(task.attachment) ? task.attachment : [];
    const file = attachments.find(f => String(f.id) === String(fileId));
    if (!file) throw new Error("File not found");
    const resolved = path.resolve(file.path);
    if (!resolved.startsWith(path.resolve(process.cwd(), 'uploads') + path.sep) || !fs.existsSync(resolved)) throw new Error('File not found');
    return { ...file, path: resolved };
};

export const deleteTaskFile = async (taskId, fileId) => {
    const file = await fileService.deleteSingleFile(taskId, fileId);
    cacheService.delByPrefix('tasks:');
    return file;
};
