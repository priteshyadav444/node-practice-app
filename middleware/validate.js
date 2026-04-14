import { validationResult } from "express-validator";
import { sendError } from "../utils/responseHelper.js";

export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const firstMessage = errors.array()[0].msg;
        sendError(res, firstMessage, 422, errors);
        return res.status(422).json()
    }
    next();
}