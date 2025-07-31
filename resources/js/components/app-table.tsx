import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { hasPermission } from '@/utils/authorization';
import { usePage } from '@inertiajs/react';
import * as LucidIcons from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface TableColumn {
    label: string;
    key: string;
    isImage?: boolean;
    isAction?: boolean;
    className?: string;
    type?: string;
}

interface ActionColumn {
    label: string;
    icon: keyof typeof LucidIcons;
    route: string;
    className: string;
    permission?: string;
}

interface TableRow {
    [key: string]: any;
}

interface AppTableProps {
    columns: TableColumn[];
    actions: ActionColumn[];
    data: TableRow[];
    from: number;
    onDelete: (route: string) => void;
    onEdit: (row: TableRow) => void;
    isModal?: boolean;
}

export const AppTable = ({ columns, actions, data, from, onEdit, onDelete, isModal }: AppTableProps) => {
    const { auth } = usePage().props as any;
    const roles = auth.roles;
    const permissions = auth.permissions;

    const renderActionButton = (row: TableRow) => {
        return (
            <div className="flex gap-1">
                {actions.map((action, index) => {
                    const IconComponent = LucidIcons[action.icon] as React.ElementType;

                    if (isModal) {
                        if (action.label === 'Edit' /**&& action.permission && hasPermission(permissions, action.permission)*/) {
                            return (
                                <Button variant="ghost" key={index} className={action.className} onClick={() => onEdit(row)}>
                                    <IconComponent size={18} />
                                </Button>
                            );
                        }
                    }

                    if (action.label === 'Delete' && action.permission && hasPermission(permissions, action.permission)) {
                        return (
                            <Button variant="ghost" key={index} className={action.className} onClick={() => onDelete(route(action.route, row.id))}>
                                <IconComponent size={18} />
                            </Button>
                        );
                    }
                })}
            </div>
        );
    };

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="font-bold">Sl No.</TableHead>
                    {columns.map((column, index) => (
                        <TableHead key={column.key}>{column.label}</TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {data?.length > 0 ? (
                    data.map((row, index) => (
                        <TableRow key={index}>
                            <TableCell>{index + from}</TableCell>
                            {columns.map((col) => (
                                <TableCell key={col.key}>
                                    {col.isAction ? (
                                        renderActionButton(row)
                                    ) : col.type === 'multi-values' && Array.isArray(row[col.key]) ? (
                                        <div className="flex flex-wrap items-center justify-center gap-1">
                                            {row[col.key].map((permission: any) => (
                                                <Badge key={permission.id} variant="outline">
                                                    {permission.label}
                                                </Badge>
                                            ))}
                                        </div>
                                    ) : (
                                        row[col.key]
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))
                ) : (
                    <TableRow className="text-center">
                        <TableCell colSpan={4}>No data found.</TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
};
