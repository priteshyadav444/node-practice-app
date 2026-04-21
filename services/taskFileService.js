import { Task } from "../models/index.js";
import fs from "fs";
import path from "path";
import * as cacheService from "./cacheService.js";

export const uploadTaskFile = async (taskId, file) => {
    // Save file info in DB (or in Task.attachment array)
    const task = await Task.findOne({ where: { id: taskId } });
    if (!task) throw new Error("Task not found");
    let attachments = Array.isArray(task.attachment) ? task.attachment : [];
    const fileData = {
        id: Date.now() + Math.round(Math.random() * 1e9),
        originalname: file.originalname,
        filename: file.filename,
        path: file.path,
        mimetype: file.mimetype,
        size: file.size,
        uploadedAt: new Date()
    };
    attachments.push(fileData);
    await task.update({ attachment: attachments });
    // Invalidate tasks cache since attachments changed
    cacheService.delByPrefix('tasks:');
    return fileData;
};

export const getTaskFile = async (taskId, fileId) => {
    const task = await Task.findOne({ where: { id: taskId } });
    if (!task) throw new Error("Task not found");
    const attachments = Array.isArray(task.attachment) ? task.attachment : [];
    const file = attachments.find(f => String(f.id) === String(fileId));
    if (!file) throw new Error("File not found");
    return file;
};

export const deleteTaskFile = async (taskId, fileId) => {
    const task = await Task.findOne({ where: { id: taskId } });
    if (!task) throw new Error("Task not found");
    let attachments = Array.isArray(task.attachment) ? task.attachment : [];
    const fileIndex = attachments.findIndex(f => String(f.id) === String(fileId));
    if (fileIndex === -1) throw new Error("File not found");
    const [file] = attachments.splice(fileIndex, 1);
    await task.update({ attachment: attachments });
    // Optionally delete file from disk
    try {
        fs.unlinkSync(path.resolve(file.path));
    } catch (e) {}
    // Invalidate tasks cache since attachments changed
    cacheService.delByPrefix('tasks:');
    return file;
};
