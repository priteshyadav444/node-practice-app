

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