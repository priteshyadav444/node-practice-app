import { sendResponse, sendServerError } from "../utils/responseHelper.js";
import * as authService from "../services/authService.js";
import { matchedData } from "express-validator";

export const register = async (req, res) => {
    try {
        const data = matchedData({ locations: 'body' });
        const user = await authService.createUser(data);
        return sendResponse(res, "Registered successfully!", user)
    } catch (error) {
        sendServerError(res, error);
    }
};

export const login = async (req, res) => {
    try {
        const user = await authService.login(req.body);
        return sendResponse(res, "Login successfully!", user);
    } catch (error) {
        sendServerError(res, error);
    }
}