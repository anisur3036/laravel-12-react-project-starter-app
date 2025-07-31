export const hasRole = (role: string, userRoles: string[] = []) => {
    return userRoles.includes(role);
};

export const hasPermission = (permissions: string[], userPermissions: string) => {
    return permissions.includes(userPermissions);
};
