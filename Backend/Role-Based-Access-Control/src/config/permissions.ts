// PERMISSIONS data


export const ALL_PERMISSIONS = [
    // user permissions
    "user:role:write",
    "user:role:read",

    // post permissions
    "post:write",
    "post:read",
    "post:delete",
    "post:edit-own"
];

// convert permissions to object
export const PERMISSION = ALL_PERMISSIONS.reduce(
    (acc, permission) => {
        acc[permission] = permission // {permission : permission}
        return acc;
    },
    {} as Record<(typeof ALL_PERMISSIONS)[number], (typeof ALL_PERMISSIONS)[number]>);


export const SYSTEM_ROLES = {
    SUPER_ADMIN: "SUPER_ADMIN",
    APPLICATION_USER: "APPLICATION_USER",
}