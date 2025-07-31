import { AppTable } from '@/components/app-table';
import { AppToast, toast } from '@/components/app-toast';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserTableConfig } from '@/config/tables/user-table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { PlusIcon } from 'lucide-react';
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

    const openModal = (mode: 'create' | 'edit' | 'view', user?: any) => {
        setMode(mode);

        if (user) {
            Object.entries(user).forEach(([key, value]) => {
                if (key === 'roles' && Array.isArray(value)) {
                    setData('roles', value[0]?.name);
                } else {
                    setData(key as keyof typeof data, (value as string | null) ?? '');
                }
            });
            setSelectedUser(user);
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
                <Input className="max-w-sm" placeholder="Please search user..." />
                <UserModal
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    handleSubmit={handleSubmit}
                    open={open}
                    onOpenChange={handleModalOpen}
                    mode={mode}
                    /*@ts-ignore*/
                    roles={props.roles}
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

interface Roles {
    id: number;
    name: string;
    label: string;
}

interface UserModalProps {
    data: Record<string, any>;
    setData: (name: string, value: any) => void;
    errors: Record<string, string>;
    processing: boolean;
    handleSubmit: (data: any) => void;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode: 'create' | 'edit' | 'view';
    roles?: Roles[];
}

const UserModal = ({ data, setData, errors, processing, handleSubmit, open, onOpenChange, roles, mode = 'create' }: UserModalProps) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange} modal>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <PlusIcon /> Add user
                </Button>
            </DialogTrigger>
            <DialogContent onInteractOutside={(e) => e.preventDefault()} className="max-h-screen overflow-y-auto sm:max-w-[600px]">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <DialogHeader>
                        <DialogTitle>{mode === 'edit' ? 'Edit user' : 'Create user'}</DialogTitle>
                        <DialogDescription>Fill in the details below to create/edit a new user.</DialogDescription>
                    </DialogHeader>
                    <div className="grid flex-1 gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                tabIndex={1}
                                type="text"
                                placeholder="Enter your full name"
                                autoFocus={true}
                                onChange={(e) => setData('name', e.target.value)}
                                value={data.name}
                                disabled={processing}
                            />
                            <InputError message={errors?.name} />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                tabIndex={2}
                                type="email"
                                placeholder="Enter your email"
                                onChange={(e) => setData('email', e.target.value)}
                                value={data.email}
                                disabled={processing}
                            />
                            <InputError message={errors?.email} />
                        </div>
                        {mode === 'create' && (
                            <div>
                                <div className="grid gap-3">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        tabIndex={3}
                                        type="password"
                                        placeholder="Enter your password"
                                        onChange={(e) => setData('password', e.target.value)}
                                        value={data.password}
                                        disabled={processing}
                                    />
                                    <InputError message={errors?.password} />
                                </div>
                                <div className="mt-4 grid gap-3">
                                    <Label htmlFor="confirm-password">Confirm password</Label>
                                    <Input
                                        id="confirm-password"
                                        tabIndex={4}
                                        type="password"
                                        placeholder="Enter your password again"
                                        onChange={(e) => setData('confirm_password', e.target.value)}
                                        value={data.confirm_password}
                                        disabled={processing}
                                    />
                                    <InputError message={errors?.confirm_password} />
                                </div>
                            </div>
                        )}
                        <div className="grid gap-3">
                            <Label htmlFor="roles">Roles</Label>
                            <Select disabled={processing} value={data.roles || ''} onValueChange={(value) => setData('roles', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select role"></SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {roles &&
                                        roles.map((role, i) => (
                                            <SelectItem key={role.id} value={role.name}>
                                                {role.label}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors?.roles} />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">{mode === 'create' ? 'Create user' : 'Update user'}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
