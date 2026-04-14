import { sendResponse, sendServerError } from "../utils/responseHelper.js";
import * as authService from "../services/authService.js";

export const register = async (req, res) => {
    try {
        const user = await authService.createUser(req.body);
        return sendResponse(res, "Login successfully!", user)
    } catch (error) {
        sendServerError(res, error);
    }
};