import { AppFormModal } from '@/components/app-form-modal';
import { AppTable } from '@/components/app-table';
import { AppToast, toast } from '@/components/app-toast';
import { Input } from '@/components/ui/input';
import { UserModalFormConfig } from '@/config/modals/user-modal';
import { UserTableConfig } from '@/config/tables/user-table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manage users',
        href: '/users',
    },
];

interface FlashProps extends Record<string, any> {
    flash?: {
        success?: string;
        error?: string;
    };
}

interface User {
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
    users: User;
}

export default function Index({ users }: IndexProps) {
    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState<'create' | 'edit' | 'view'>('create');
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const { props } = usePage();
    const { data, setData, errors, processing, reset, post } = useForm<{
        name: string;
        email: string;
        password: string;
        roles: string;
        _method: string;
    }>({
        name: '',
        email: '',
        password: '',
        roles: '',
        _method: 'POST',
    });

    // Handle Submit
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (mode === 'edit' && selectedUser) {
            data._method = 'PUT';
            post(route('users.update', selectedUser.id), {
                // forceFormData: true,
                onSuccess: (response: { props: FlashProps }) => {
                    const successMessage = response.props.flash?.success;
                    toast.success(successMessage);
                    closeModal();
                },
            });
        } else {
            post(route('users.store'), {
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

    const openModal = (mode: 'create' | 'edit' | 'view', role?: any) => {
        setMode(mode);

        if (role) {
            Object.entries(role).forEach(([key, value]) => {
                if(key === 'roles' && Array.isArray(value)) {
                    setData('roles', value[0]?.name);
                } else {
                    setData(key as keyof typeof data, (value as string | null) ?? '');
                }
            });
            setSelectedUser(role);
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
            <Head title="Users" />
            <AppToast />
            <div className="m-4 flex items-center justify-between">
                <Input
                    className="max-w-sm"
                    placeholder="Please search user..."
                />

                <AppFormModal
                    /*@ts-ignore*/
                    config={UserModalFormConfig}
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    handleSubmit={handleSubmit}
                    open={open}
                    onOpenChange={handleModalOpen}
                    mode={mode}
                    extraData={props}
                />
            </div>
            <div className="mx-4 flex h-full flex-1 flex-col gap-4 rounded-xl">
                <AppTable
                    columns={UserTableConfig.columns}
                    /*@ts-ignore*/
                    actions={UserTableConfig.actions}
                    data={users.data}
                    from={users.meta.from}
                    onEdit={(user) => openModal('edit', user)}
                    onDelete={handleDelete}
                    isModal={true}
                />
            </div>
        </AppLayout>
    );
}
