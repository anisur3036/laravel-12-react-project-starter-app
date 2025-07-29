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
import { LoaderCircle, LucideIcon } from 'lucide-react';
import InputError from './input-error';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';

interface AddButtonObj {
    id: string;
    label: string;
    className: string;
    icon: LucideIcon;
    type: 'button' | 'submit' | 'reset' | undefined;
    variant: 'default' | 'outline' | 'ghost' | 'link' | 'destructive' | undefined;
    permission?: string;
}

interface Permissions {
    id: number;
    label: string;
    name: string;
    module: string;
    description: string;
}

interface FieldOptions {
    kay: string;
    value: string;
    label: string;
}

interface FieldObj {
    id: string;
    key: string;
    name: string;
    label: string;
    type: string;
    placeholder?: string;
    autocomplete?: string;
    tabIndex: number;
    autoFocus?: boolean;
    rows?: number;
    accept?: string;
    className?: string;
    options?: { label: string; value: string; key: string }[];
}

interface ConfigObj {
    title: string;
    editTitle: string;
    description: string;
    addButton: AddButtonObj;
    fields: FieldObj[];
}

interface ExtraData {
    [module: string]: Permissions[];
}

interface AppFormModalProps {
    config: ConfigObj;
    // buttons: ButtonProps[];
    data: Record<string, any>;
    setData: (name: string, value: any) => void;
    errors: Record<string, string>;
    processing: boolean;
    handleSubmit: (data: any) => void;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode: 'create' | 'edit' | 'view';
    // previewImage?: string | null;
    extraData?: ExtraData;
}

export function AppFormModal({
    config,
    data,
    setData,
    errors,
    processing,
    handleSubmit,
    open,
    onOpenChange,
    extraData,
    mode = 'create',
}: AppFormModalProps) {
    const { title, editTitle, description, addButton, fields } = config;

    return (
        <Dialog open={open} onOpenChange={onOpenChange} modal>
            <DialogTrigger asChild>
                <Button variant="outline">
                    {addButton.icon && <addButton.icon />} {addButton.label}
                </Button>
            </DialogTrigger>
            <DialogContent onInteractOutside={(e) => e.preventDefault()} className="sm:max-w-[600px]">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <DialogHeader>
                        <DialogTitle>{mode === 'edit' ? editTitle : title}</DialogTitle>
                        <DialogDescription>{description}</DialogDescription>
                    </DialogHeader>
                    <div className="grid flex-1 gap-4">
                        {fields.map((field, i) => (
                            <div className="grid gap-3" key={i}>
                                <Label htmlFor={field.id}>{field.label}</Label>
                                {field.type === 'textarea' ? (
                                    <Textarea
                                        name={field.name}
                                        id={field.id}
                                        placeholder={field.placeholder}
                                        autoComplete={field.autocomplete}
                                        tabIndex={field.tabIndex}
                                        rows={field.rows}
                                        onChange={(e) => setData(field.name, e.target.value)}
                                        value={data[field.name] || ''}
                                        disabled={processing}
                                    />
                                ) : field.type === 'single-select' ? (
                                    <Select
                                        disabled={processing}
                                        value={data[field.name] || ''}
                                        onValueChange={(value) => setData(field.name, value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={`Select ${field.label}`}></SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {(field.options?.length
                                                ? field.options
                                                : (extraData?.[field.key] || []).map((item: any) => ({
                                                        key:item.id,
                                                        value: item.name,
                                                        label: item.label
                                                    })
                                            ))?.map((option) => (
                                                <SelectItem key={option.key} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                ) : field.type === 'grouped-checkbox' ? (
                                    <div className="space-y-2">
                                        {extraData &&
                                            Object.entries(extraData).map(([module, permissions]) => (
                                                <div key={module} className="mb-4 border-b pb-5">
                                                    <h4 className="text-sm font-bold text-gray-700 capitalize">{module}</h4>
                                                    <div className="ms-4 mt-2 grid grid-cols-3 gap-2">
                                                        {permissions.map((permission) => (
                                                            <label key={permission.id} className="flex items-center gap-2 text-sm">
                                                                <input
                                                                    type="checkbox"
                                                                    name={field.name}
                                                                    value={permission.name}
                                                                    checked={data.permissions.includes(permission.name)}
                                                                    onChange={(e) => {
                                                                        const value = permission.name;
                                                                        const current = data.permissions || [];

                                                                        if (e.target.checked) {
                                                                            setData('permissions', [...current, value]);
                                                                        } else {
                                                                            setData(
                                                                                'permissions',
                                                                                current.filter((permission: string) => permission !== value),
                                                                            );
                                                                        }
                                                                    }}
                                                                />
                                                                <span>{permission.label}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                ) : field.type === 'password' ? (
                                    <Input
                                        id={field.id}
                                        type={field.type}
                                        name={field.name}
                                        autoFocus={field.autoFocus}
                                        onChange={(e) => setData(field.name, e.target.value)}
                                        value={data[field.name] || ''}
                                        disabled={processing}
                                    />
                                ) : field.type=== 'email' ? (
                                    <Input
                                        id={field.id}
                                        type={field.type}
                                        name={field.name}
                                        autoFocus={field.autoFocus}
                                        onChange={(e) => setData(field.name, e.target.value)}
                                        value={data[field.name] || ''}
                                        disabled={processing}
                                    />
                                ) : (
                                    <Input
                                        id={field.id}
                                        name={field.name}
                                        autoFocus={field.autoFocus}
                                        onChange={(e) => setData(field.name, e.target.value)}
                                        value={data[field.name] || ''}
                                        disabled={processing}
                                    />
                                )}
                                {/* Form Validation error */}
                                <InputError message={errors?.[field.name]} />
                            </div>
                        ))}
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={processing}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            {mode === 'edit' ? 'Save changes' : 'Save'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
