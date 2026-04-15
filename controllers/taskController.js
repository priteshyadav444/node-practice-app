import { sendResponse, sendServerError } from "../utils/responseHelper.js";
import * as taskService from "../services/taskService.js";
import { matchedData } from "express-validator";

export const createTask = async (req, res) => {
    try {
        const data = matchedData(req, { locations: ['body'] });
        console.log(data);
        const task = await taskService.createTask(data);
        return sendResponse(res, "Task successfully!", task)
    } catch (error) {
        sendServerError(res, error);
    }
};
