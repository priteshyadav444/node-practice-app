// Central permission helper usable in server, controllers and EJS views
// Roles: 'admin', 'manager', 'user' (case-insensitive)

const ROLE_PERMISSIONS = {
    admin: ['task:create', 'task:edit', 'task:delete', 'task:view',  'task:assign'],
    manager: ['task:create', 'task:edit', 'task:view',  'task:assign'],
    user: ['task:create', 'task:view']
};

export function normalizeRole(r) {
    if (!r) return null;
    return String(r).toLowerCase();
}

export function hasPermission(user, permission) {
    // permission: string like 'task:create' or 'task:edit'
    const role = normalizeRole(user?.role || user);
    if (!role) return false;
    const perms = ROLE_PERMISSIONS[role] || [];
    return perms.indexOf(permission) !== -1;
}

export default { hasPermission, ROLE_PERMISSIONS };
