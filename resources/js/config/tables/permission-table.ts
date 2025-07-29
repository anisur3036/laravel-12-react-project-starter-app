export const PermissionsTableConfig = {
    columns: [
        { label: 'Permission Name', key: 'name', className: 'border p-4' },
        { label: 'Display name', key: 'label', className: 'capitalize border p-4' },
        { label: 'Module', key: 'module', className: 'capitalize border p-4' },
        { label: 'Description', key: 'description', className: 'w-90 border p-4' },
        { label: 'Actions', key: 'actions', isAction: true, className: 'border p-4' },
    ],
    actions: [
        {
            label: 'Edit',
            icon: 'Pencil',
            className: 'cursor-pointer p-0.5 text-blue-500 hover:opacity-90',
            permission: 'edit-permission',
        },
        {
            label: 'Delete',
            icon: 'Trash2',
            route: 'permissions.destroy',
            className: 'cursor-pointer p-0.5 text-red-500 hover:opacity-90',
            permission: 'delete-permission',
        },
    ],
};
