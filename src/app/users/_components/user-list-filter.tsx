import { Search, X } from "lucide-react";
import { Input } from "@/app/_components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/app/_components/ui/select";
import { Button } from "@/app/_components/ui/button";

interface UserListFilterProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    roleFilter: string;
    onRoleChange: (value: string) => void;
    statusFilter: string;
    onStatusChange: (value: string) => void;
    onReset: () => void;
    isFiltered: boolean;
}

export const UserListFilter = ({
    searchQuery,
    onSearchChange,
    roleFilter,
    onRoleChange,
    statusFilter,
    onStatusChange,
    onReset,
    isFiltered,
}: UserListFilterProps) => {
    return (
        <section aria-label="Filter User" className="mb-6 flex flex-col md:flex-row gap-3 items-end md:items-center w-full">
            <div className="relative flex-1 max-w-xs w-full">
                <label htmlFor="search-user" className="sr-only">Cari user</label>
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                    <Search className="h-4 w-4" />
                </div>
                <Input
                    aria-label="Search user"
                    id="search-user"
                    type="search"
                    placeholder="Cari nama, email, role..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-10 bg-white dark:bg-slate-950"
                />
            </div>

            <div className="flex gap-3 w-full md:w-auto">
                <div className="w-40">
                    <Select value={roleFilter || "all"} onValueChange={(val) => onRoleChange(val === "all" ? "" : val)}>
                        <SelectTrigger className="w-full bg-white dark:bg-slate-950">
                            <SelectValue placeholder="Semua Role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Role</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="operator">Operator</SelectItem>
                            <SelectItem value="viewer">Viewer</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="w-40">
                    <Select value={statusFilter || "all"} onValueChange={(val) => onStatusChange(val === "all" ? "" : val)}>
                        <SelectTrigger className="w-full bg-white dark:bg-slate-950">
                            <SelectValue placeholder="Semua Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Status</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="invited">Invited</SelectItem>
                            <SelectItem value="suspended">Suspended</SelectItem>
                        </SelectContent>
                    </Select>
                </div>


                {isFiltered && (
                    <Button variant="ghost" onClick={onReset} className="text-slate-500 hover:text-slate-900 dark:hover:text-white px-2">
                        <X className="h-4 w-4 mr-1" />
                        Reset
                    </Button>
                )}
            </div>
        </section>
    );
};
