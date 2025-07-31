import { AppFormModal } from '@/components/app-form-modal';
import { AppTable } from '@/components/app-table';
import { AppToast, toast } from '@/components/app-toast';
import { Input } from '@/components/ui/input';
import { RoleModalFormConfig } from '@/config/modals/role-modal';
import { RoleTableConfig } from '@/config/tables/role-table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manage Roles',
        href: '/roles',
    },
];

interface FlashProps extends Record<string, any> {
    flash?: {
        success?: string;
        error?: string;
    };
}

interface Role {
    data: {
        id: string;
        name: string;
        label: string;
        description: string;
    }[];
    meta: {
        from: number;
    };
}

interface IndexProps {
    roles: Role;
}

export default function Index({ roles }: IndexProps) {
    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState<'create' | 'edit' | 'view'>('create');
    const [selectedRole, setSelectedRole] = useState<any>(null);
    const { permissions } = usePage().props;
    const { data, setData, errors, processing, reset, post } = useForm<{
        label: string;
        description: string;
        permissions: string[];
        _method: string;
    }>({
        label: '',
        description: '',
        permissions: [],
        _method: 'POST',
    });

    // Handle Submit
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (mode === 'edit' && selectedRole) {
            data._method = 'PUT';
            post(route('roles.update', selectedRole.id), {
                // forceFormData: true,
                onSuccess: (response: { props: FlashProps }) => {
                    const successMessage = response.props.flash?.success;
                    toast.success(successMessage);
                    closeModal();
                },
            });
        } else {
            post(route('roles.store'), {
                onSuccess: (response: { props: FlashProps }) => {
                    const successMessage = response.props.flash?.success;
                    toast.success(successMessage);
                    closeModal();
                },
                onError: (error: Record<string, string>) => {},
            });
        }
    };

    const closeModal = () => {
        setMode('create');
        reset();
        setOpen(false);
    };

    // modal open
    const handleModalOpen = (open: boolean) => {
        setOpen(open);

        if (!open) {
            setMode('create');
            reset();
        }
    };

    const openModal = (mode: 'create' | 'edit', role?: any) => {
        setMode(mode);

        if (role) {
            Object.entries(role).forEach(([key, value]) => {
                if (key === 'permissions' && Array.isArray(value)) {
                    setData(
                        'permissions',
                        value.map((permission: any) => permission.name),
                    );
                } else {
                    setData(key as keyof typeof data, (value as string | null) ?? '');
                }
            });

            setSelectedRole(role);
        } else {
            reset();
        }

        setOpen(true);
    };

    // Handle Delete
    const handleDelete = (route: string) => {
        if (confirm('Are you sure, you want to delete?')) {
            router.delete(route, {
                preserveScroll: true,
                onSuccess: (response) => {
                    closeModal();
                },
                onError: (error: Record<string, string>) => {
                    const errorMessage = error?.message;
                    closeModal();
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles" />
            <AppToast />
            <div className="m-4 flex items-center justify-between">
                <Input
                    // onBlur={(e) => searchFieldChanged("name", e.target.value)}
                    // onKeyPress={(e) => onKeyPress("name", e)}
                    // defaultValue={queryParams.name}
                    className="max-w-sm"
                    placeholder="Please search role..."
                />

                <AppFormModal
                    /*@ts-ignore*/
                    config={RoleModalFormConfig}
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    handleSubmit={handleSubmit}
                    open={open}
                    onOpenChange={handleModalOpen}
                    mode={mode}
                    extraData={permissions}
                />
            </div>
            <div className="mx-4 flex h-full flex-1 flex-col gap-4 rounded-xl">
                <AppTable
                    columns={RoleTableConfig.columns}
                    /*@ts-ignore*/
                    actions={RoleTableConfig.actions}
                    data={roles.data}
                    from={roles.meta.from}
                    onEdit={(role) => openModal('edit', role)}
                    onDelete={handleDelete}
                    isModal={true}
                />
            </div>
        </AppLayout>
    );
}
