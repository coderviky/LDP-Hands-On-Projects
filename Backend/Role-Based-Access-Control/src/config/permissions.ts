// PERMISSIONS data

// PERMISSIONS String Consts
export const USER_ROLE_WRITE = "user:role:write"
export const USER_ROLE_READ = "user:role:read"

export const ROLE_WRITE = "role:write"

export const POST_WRITE = "post:write"
export const POST_READ = "post:read"
export const POST_DELETE = "post:delete"
export const POST_EDIT_OWN = "post:edit-own"


export const ALL_PERMISSIONS = [
    // user permissions
    // "user:role:write",
    // "user:role:read",
    USER_ROLE_WRITE,
    USER_ROLE_READ,

    // role permissions
    // "role:write",
    ROLE_WRITE,

    // post permissions
    // "post:write",
    // "post:read",
    // "post:delete",
    // "post:edit-own"
    POST_WRITE,
    POST_READ,
    POST_DELETE,
    POST_EDIT_OWN
] as const;

// convert permissions to object
export const PERMISSIONS = ALL_PERMISSIONS.reduce(
    (acc, permission) => {
        acc[permission] = permission // {permission : permission}
        return acc;
    },
    {} as Record<(typeof ALL_PERMISSIONS)[number], (typeof ALL_PERMISSIONS)[number]>);

export const USER_ROLE_PERMISSIONS = [
    // PERMISSIONS[POST_WRITE],
    PERMISSIONS[POST_READ],   // any user created other than super admin will get only read permission
];

export const SYSTEM_ROLES = {
    SUPER_ADMIN: "SUPER_ADMIN",
    APPLICATION_USER: "APPLICATION_USER",
}