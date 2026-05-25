import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { StatusBadge } from '@/app/_components/status-badge';
import { EmptyState } from '@/app/_components/empty-state';
import type { TRequest } from '@/api/requests/types';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface RequestTableProps {
    requests: TRequest[];
    isFiltered: boolean;
}

export const RequestTable = ({ requests, isFiltered }: RequestTableProps) => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Judul</TableHead>
                    <TableHead>Deskripsi</TableHead>
                    <TableHead>Tanggal Dibuat</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[120px]">Aksi</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {requests.length > 0 ? (
                    requests.map((req) => (
                        <TableRow key={req.id}>
                            <TableCell className="font-semibold">{req.id}</TableCell>
                            <TableCell className="font-medium">
                                <Link to={`/requests/${req.id}`} className="hover:underline hover:text-primary transition-colors">
                                    {req.title}
                                </Link>
                            </TableCell>
                            <TableCell className="max-w-xs truncate">{req.description}</TableCell>
                            <TableCell>{req.createdAt}</TableCell>
                            <TableCell>
                                <StatusBadge status={req.status} />
                            </TableCell>
                            <TableCell>
                                <Button variant="outline" size="sm" asChild>
                                    <Link to={`/requests/${req.id}`}>
                                        <Eye className="h-3.5 w-3.5" />
                                        Detail
                                    </Link>
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={6} className="p-0">
                            <EmptyState
                                title={isFiltered ? "Pencarian Tidak Ditemukan" : "Data Request Kosong"}
                                description={
                                    isFiltered
                                        ? "Tidak ada data request yang sesuai dengan kata kunci pencarian Anda."
                                        : "Belum ada data request di sistem ini."
                                }
                            />
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
};
