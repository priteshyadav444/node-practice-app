import { validationResult } from "express-validator";
import { sendError } from "../utils/responseHelper.js";

export const validate = (includeErrors = false) => (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const firstMessage = errors.array()[0].msg;
        let payload = includeErrors ? errors : null;
        sendError(res, firstMessage, 422, payload);
    }
    next();
}