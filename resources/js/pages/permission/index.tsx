import { AppFormModal } from '@/components/app-form-modal';
import { AppTable } from '@/components/app-table';
import { Input } from '@/components/ui/input';
import { PermissionModalFormConfig } from '@/config/modals/permission-modal';
import { PermissionsTableConfig } from '@/config/tables/permission-table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manage Permissions',
        href: '/permissions',
    },
];

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
    };
}

interface IndexProps {
    permissions: Permission;
}

export default function Index({ permissions }: IndexProps) {
    const { data, setData, errors, processing, reset, post } = useForm({
        module: '',
        name: '',
        label: '',
        description: '',
        _method: 'POST',
    });

    // Handle Submit
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('permissions.store'), {
            onSuccess: () => {},
            onError: (error: Record<string, string>) => {},
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Permissions" />
            <div className="m-4 flex items-center justify-between">
                <Input
                    // onBlur={(e) => searchFieldChanged("name", e.target.value)}
                    // onKeyPress={(e) => onKeyPress("name", e)}
                    // defaultValue={queryParams.name}
                    className="max-w-sm"
                    placeholder="Search buyer..."
                />
                <AppFormModal
                    config={PermissionModalFormConfig}
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    handleSubmit={handleSubmit}
                />
            </div>
            <div className="mx-4 flex h-full flex-1 flex-col gap-4 rounded-xl">
                <AppTable
                    columns={PermissionsTableConfig.columns}
                    actions={PermissionsTableConfig.actions}
                    data={permissions.data}
                    from={permissions.meta.from}
                />
            </div>
        </AppLayout>
    );
}
