import { Link } from '@inertiajs/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface PaginationProps {
    perPage: string;
    onPerPageChange: (value: string) => void;
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
}
export const Pagination = ({ meta, perPage, onPerPageChange }: PaginationProps) => {
    return (
        <div className="flex items-center justify-between gap-2 py-4">
            <p className="text-sm">
                Showing {meta.from} to {meta.to} from totals {meta.total} entries
            </p>
            <div className="flex items-center gap-2">
                <span>Select row:</span>
                <Select onValueChange={onPerPageChange} value={perPage}>
                    <SelectTrigger className="w-[90px]">
                        <SelectValue placeholder="Row" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex items-center gap-2">
                {meta.links.map((link, i) => (
                    <Link
                        href={link.url}
                        prefetch
                        key={i}
                        className={`rounded border px-3 py-2 ${link.active ? 'bg-black text-white' : ''}`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    ></Link>
                ))}
            </div>
        </div>
    );
};
