import upload from '../middleware/upload.js';
import { setFlashMessage } from './sessionHelper.js';

export const sendResponse = (res, message = "Request successfully", payload = null, status = 200) => {
    let response = { status: true, message };
    if (payload) {
        response = { ...response, data: payload };
    }
    res.status(status).json(response);
};

export const sendError = (res, message = "Bad Request", status = 400, errorPayload = null) => {
    let response = { success: false, message };
    if (errorPayload) {
        response = { ...response, errors: errorPayload.errors };
    }
    res.status(status).json(response)
};

export const sendServerError = (res, err) => {
    return sendError(res, err?.message || "Server Error", 500);
};

// Multer error handler middleware for file size
export function handleMulterError(field) {
	return function(req, res, next) {
		upload.array(field)(req, res, function(err) {
			if (err && err.code === 'LIMIT_FILE_SIZE') {
				setFlashMessage(req, 'File too large. Max size is 2MB.', 'error');
				return res.redirect('/tasks');
			}
			next(err);
		});
	};
}