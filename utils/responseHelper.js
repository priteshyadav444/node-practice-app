

export const sendResponse = (res, message = "Request successfully", payload = null, status = 200) => {
    let response = { status: true, message };
    if (payload) {
        response = { ...response, data: payload };
    }
    res.status(status).json(response);
};

export const sendError = (res, message = "Bad Request", status = 400) => {
    res.status(status).json({ success: false, message })
};


export const sendServerError = (res, err) => {
    return sendError(res, err?.message || "Server Error", 500);
};