import { AppFormModal } from '@/components/app-form-modal';
import { AppTable } from '@/components/app-table';
import { AppToast, toast } from '@/components/app-toast';
import { Pagination } from '@/components/pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PermissionModalFormConfig } from '@/config/modals/permission-modal';
import { PermissionsTableConfig } from '@/config/tables/permission-table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { XIcon } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manage Permissions',
        href: '/permissions',
    },
];

interface FlashProps extends Record<string, any> {
    flash?: {
        success?: string;
        error?: string;
    };
}

interface Permission {
    data: {
        id: string;
        module: string;
        name: string;
        label: string;
        description: string;
    }[];
    meta: {
        from: number;
        current_page: number;
        last_page: number;
        per_page: number;
        to: number;
        total: number;
        links: {
            active: boolean;
            label: string;
            url: string;
        }[];
    };
    links: {
        first: string;
        last: string;
        next: string;
        prev: string;
    }[];
}

interface IndexProps {
    permissions: Permission;
    filters: {
        search: string;
        perPage: string;
    };
}

export default function Index({ permissions, filters }: IndexProps) {
    const { flash } = usePage<{ flash?: { success?: string; error?: string } }>().props;
    const flashMessage = flash?.success || flash?.error;
    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState<'create' | 'edit'>('create');
    const [selectedPermission, setSelectedPermission] = useState<any>(null);

    const { data, setData, errors, processing, reset, post } = useForm({
        module: '',
        name: '',
        label: '',
        description: '',
        search: filters.search || '',
        perPage: filters.perPage || '10',
        _method: 'POST',
    });

    // Handle Submit
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (mode === 'edit' && selectedPermission) {
            data._method = 'PUT';
            post(route('permissions.update', selectedPermission.id), {
                // forceFormData: true,
                onSuccess: (response: { props: FlashProps }) => {
                    const successMessage = response.props.flash?.success;
                    toast.success(successMessage);
                    closeModal();
                },
            });
        } else {
            post(route('permissions.store'), {
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

    const openModal = (mode: 'create' | 'edit', permission?: any) => {
        setMode(mode);

        if (permission) {
            Object.entries(permission).forEach(([key, value]) => {
                setData(key as keyof typeof data, value as string);
            });

            setSelectedPermission(permission);
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setData('search', value);

        const queryString = value ? { search: value } : {};

        router.get(route('permissions.index'), queryString, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const clearFilters = () => {
        setData('search', '');
        router.get(
            route('permissions.index'),
            { search: '' },
            {
                preserveScroll: true,
                preserveState: true,
            },
        );
    };

    const handlePerPageChange = (value: string) => {
        setData('perPage', value);

        router.get(
            route('permissions.index'),
            { perPage: value },
            {
                preserveScroll: true,
                preserveState: true,
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Permissions" />
            <AppToast />
            <div className="m-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Input defaultValue={data.search} onBlur={handleChange} className="max-w-sm" placeholder="Please search permission..." />
                    <Button onClick={clearFilters} className="cursor-pointer text-red-600 hover:text-red-500" variant="outline">
                        <XIcon size={18} />
                    </Button>
                </div>

                <AppFormModal
                    /*@ts-ignore*/
                    config={PermissionModalFormConfig}
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    handleSubmit={handleSubmit}
                    open={open}
                    onOpenChange={handleModalOpen}
                    mode={mode}
                />
            </div>
            <div className="mx-4 flex h-full flex-1 flex-col gap-4 rounded-xl">
                <AppTable
                    columns={PermissionsTableConfig.columns}
                    /*@ts-ignore*/
                    actions={PermissionsTableConfig.actions}
                    data={permissions.data}
                    from={permissions.meta.from}
                    onEdit={(permission) => openModal('edit', permission)}
                    onDelete={handleDelete}
                    isModal={true}
                />
                <Pagination meta={permissions.meta} perPage={data.perPage} onPerPageChange={handlePerPageChange} />
            </div>
        </AppLayout>
    );
}
