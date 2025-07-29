export const UserTableConfig = {
    columns: [
        { label: 'User Name', key: 'name', className: 'border p-4' },
        { label: 'Email', key: 'email', className: 'border p-4' },
        { label: 'Roles', key: 'roles', className: 'border p-4', type: 'multi-values' },
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
