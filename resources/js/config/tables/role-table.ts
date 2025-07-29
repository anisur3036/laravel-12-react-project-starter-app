export const RoleTableConfig = {
    columns: [
        { label: 'Role Name', key: 'name', className: 'border p-4' },
        { label: 'Description', key: 'description', className: 'w-90 border p-4' },
        { label: 'Permissions', key: 'permissions', className: 'capitalize border p-4', type: 'multi-values' },
        { label: 'Actions', key: 'actions', isAction: true, className: 'border p-4' },
    ],
    actions: [
        {
            label: 'Edit',
            icon: 'Pencil',
            className: 'cursor-pointer text-blue-500 hover:opacity-90',
            permission: 'edit-role',
        },
        {
            label: 'Delete',
            icon: 'Trash2',
            route: 'roles.destroy',
            className: 'cursor-pointer text-red-500 hover:opacity-90',
            permission: 'delete-role',
        },
    ],
};
