import { sendResponse, sendError, sendServerError } from "../utils/responseHelper.js";
import * as taskFileService from "../services/taskFileService.js";
import { matchedData } from "express-validator";

export const uploadTaskFile = async (req, res) => {
    try {
        const { id } = matchedData(req, { locations: ["params"] });
        if (!req.file) return sendError(res, "No file uploaded", 400);
        const fileData = await taskFileService.uploadTaskFile(id, req.file);
        return sendResponse(res, "File uploaded successfully!", fileData);
    } catch (error) {
        sendServerError(res, error);
    }
};

export const getTaskFile = async (req, res) => {
    try {
        const { taskId, fileId } = matchedData(req, { locations: ["params"] });
        console.log("asd");
        const file = await taskFileService.getTaskFile(taskId, fileId);
        console.log(file);
        res.download(file.path, file.originalname);
    } catch (error) {
        sendServerError(res, error);
    }
};

export const deleteTaskFile = async (req, res) => {
    try {
        const { taskId, fileId } = matchedData(req, { locations: ["params"] });
        await taskFileService.deleteTaskFile(taskId, fileId);
        return sendResponse(res, "File deleted successfully!");
    } catch (error) {
        sendServerError(res, error);
    }
};
