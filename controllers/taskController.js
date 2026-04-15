import { sendResponse, sendServerError } from "../utils/responseHelper.js";
import * as taskService from "../services/taskService.js";
import { matchedData } from "express-validator";

export const createTask = async (req, res) => {
    try {
        const data = matchedData(req, { locations: ['body'] });
        const task = await taskService.createTask(data);
        return sendResponse(res, "Task created successfully!", task)
    } catch (error) {
        sendServerError(res, error);
    }
};


export const getTaskById = async (req, res) => {
    try {
        const { id } = matchedData(req, { locations: ['params'] });
        const task = await taskService.getTaskById(id);
        return sendResponse(res, "Task fetched successfully!", task)
    } catch (error) {
        sendServerError(res, error);
    }
}

export const getTasks = async (req, res) => {
    try {
        const tasks = await taskService.getTasks();
        return sendResponse(res, "Task fetched successfully!", tasks)
    } catch (error) {
        sendServerError(res, error);
    }
}

export const updateTask = async (req, res) => {
    try {
        let data = matchedData(req, { locations: ['body'] });
        const { id } = matchedData(req, { locations: ['params'] });
       
        const task = await taskService.updateTask(id, data);
        return sendResponse(res, "Task updated successfully!", task)
    } catch (error) {
        sendServerError(res, error);
    }
};