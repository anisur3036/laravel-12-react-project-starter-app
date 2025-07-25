import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import * as LucidIcons from 'lucide-react';

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
    // from: number;
    // onDelete: (route: string) => void;
    // onView: (row: TableRow) => void;
    // onEdit: (row: TableRow) => void;
    // isModal?: boolean;
}

export const AppTable = ({ columns, actions, data, from }: AppTableProps) => {
    const renderActionButton = (row: TableRow) => {
        return (
            <div className="flex gap-2">
                {actions.map((action, index) => {
                    const IconComponent = LucidIcons[action.icon] as React.ElementType;
                    return (
                        <span className={action.className} key={index}>
                            <IconComponent size={18} />
                        </span>
                    );
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
                                <TableCell key={col.key}>{col.isAction ? renderActionButton(row) : row[col.key]}</TableCell>
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
