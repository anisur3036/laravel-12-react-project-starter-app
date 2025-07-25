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
import { useState } from 'react';
import InputError from './input-error';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';

interface AddButtonObj {
    id: string;
    label: string;
    className: string;
    icon: string;
    type: 'button' | 'submit' | 'reset' | undefined;
    variant: 'default' | 'outline' | 'ghost' | 'link' | 'destructive' | undefined;
    permission?: string;
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
    description: string;
    addButton: AddButtonObj;
    fields: FieldObj[];
}

interface AppFormModalProps {
    config: ConfigObj;
    // buttons: ButtonProps[];
    data: Record<string, any>;
    setData: (name: string, value: any) => void;
    errors: Record<string, string>;
    processing: boolean;
    handleSubmit: (data: any) => void;
    // open: boolean;
    // onOpenChange: (open: boolean) => void;
    // mode: 'create' | 'view' | 'edit';
    // previewImage?: string | null;
    // extraData?: ExtraData;
}

export function AppFormModal({ config, data, setData, errors, processing, handleSubmit }: AppFormModalProps) {
    const { title, description, addButton, fields } = config;
    const [open, setOpen] = useState(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    {addButton.icon && <addButton.icon />} {addButton.label}
                </Button>
            </DialogTrigger>
            <DialogContent onInteractOutside={(e) => e.preventDefault()} className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
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
                                            {field.options?.map((option, j) => (
                                                <SelectItem key={j} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
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
                        <Button type="submit">Save changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
