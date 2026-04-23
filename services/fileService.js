import fs from 'fs';
import path from 'path';
import { Task } from '../models/index.js';
import { moveFromTempToFinal } from '../middleware/upload.js';

const UPLOAD_DIR = path.resolve(process.cwd(), 'uploads') + path.sep;

// Securely copy a file within uploads directory
export const copyFileSafe = async (src, dest) => {
    const resolvedSrc = path.resolve(src);
    const resolvedDest = path.resolve(dest);
    if (!resolvedSrc.startsWith(UPLOAD_DIR) || !resolvedDest.startsWith(UPLOAD_DIR)) {
        throw new Error('Invalid path: must be within uploads directory');
    }
    await fs.promises.copyFile(resolvedSrc, resolvedDest);
};

const safeUnlink = (filePath) => {
    try {
        const resolved = path.resolve(filePath);
        if (!resolved.startsWith(UPLOAD_DIR)) return;
        if (fs.existsSync(resolved)) fs.unlinkSync(resolved);
    } catch (e) {}
};

export const saveFilesToTask = async (taskId, files) => {
    if (!Array.isArray(files) || files.length === 0) return [];
    const task = await Task.findOne({ where: { id: taskId } });
    if (!task) throw new Error('Task not found');

    const existing = Array.isArray(task.attachment) ? task.attachment : [];
    const added = [];

    try {
        for (const file of files) {
            // Move file from temp to uploads before validation
            await moveFromTempToFinal(file);
            const fileData = {
                id: Date.now() + Math.round(Math.random() * 1e9),
                originalname: file.originalname,
                filename: file.filename,
                path: file.path,
                mimetype: file.mimetype,
                size: file.size,
                uploadedAt: new Date()
            };
            existing.push(fileData);
            added.push({ file, fileData });
        }

        // single DB update to attach all files
        await task.update({ attachment: existing });
        return added.map(a => a.fileData);
    } catch (err) {
        // remove any uploaded files for this operation to avoid partial uploads
        for (const a of added) {
            try { safeUnlink(a.file.path); } catch (e) {}
        }
        throw err;
    }
};

export const deleteFilesForTask = async (taskId) => {
    const task = await Task.findOne({ where: { id: taskId } });
    if (!task) return;
    const attachments = Array.isArray(task.attachment) ? task.attachment : [];
    for (const f of attachments) {
        try { safeUnlink(f.path); } catch (e) {}
    }
};

export const deleteSingleFile = async (taskId, fileId) => {
    const task = await Task.findOne({ where: { id: taskId } });
    if (!task) throw new Error('Task not found');
    let attachments = Array.isArray(task.attachment) ? task.attachment : [];
    const idx = attachments.findIndex(f => String(f.id) === String(fileId));
    if (idx === -1) throw new Error('File not found');
    const [file] = attachments.splice(idx, 1);
    await task.update({ attachment: attachments });
    safeUnlink(file.path);
    return file;
};

export default { saveFilesToTask, deleteFilesForTask, deleteSingleFile };
