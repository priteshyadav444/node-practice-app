export function getCurrentUser(req){
    if(req.session != null && req.session.user){
        return req.session.user;
    }
    null;
};

export function getCurrentUserId(req){
    const user = getCurrentUser(req); 
    if(user){
        return user.id;
    }
    return null;
}

export function getCurrentUserRole(req){
    const user = getCurrentUser(req); 
    if(user){
        return user.role;
    }
    return null;
}