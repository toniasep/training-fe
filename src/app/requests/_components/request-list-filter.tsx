import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface RequestListFilterProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    statusFilter: string;
    onStatusChange: (value: string) => void;
    priorityFilter: string;
    onPriorityChange: (value: string) => void;
    onReset: () => void;
    isFiltered: boolean;
}

export const RequestListFilter = ({
    searchQuery,
    onSearchChange,
    statusFilter,
    onStatusChange,
    priorityFilter,
    onPriorityChange,
    onReset,
    isFiltered,
}: RequestListFilterProps) => {
    return (
        <section aria-label="Filter Request" className="mb-6 flex flex-col md:flex-row gap-3 items-end md:items-center w-full">
            <div className="relative flex-1 max-w-xs w-full">
                <label htmlFor="search-request" className="sr-only">Cari request</label>
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                    <Search className="h-4 w-4" />
                </div>
                <Input
                    aria-label="Search request"
                    id="search-request"
                    type="search"
                    placeholder="Cari judul, deskripsi..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-10 bg-white dark:bg-slate-950"
                />
            </div>

            <div className="flex gap-3 w-full md:w-auto">
                <div className="w-40">
                    <Select value={statusFilter || "all"} onValueChange={(val) => onStatusChange(val === "all" ? "" : val)}>
                        <SelectTrigger className="w-full bg-white dark:bg-slate-950">
                            <SelectValue placeholder="Semua Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Status</SelectItem>
                            <SelectItem value="open">Open</SelectItem>
                            <SelectItem value="in_review">In Review</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="w-40">
                    <Select value={priorityFilter || "all"} onValueChange={(val) => onPriorityChange(val === "all" ? "" : val)}>
                        <SelectTrigger className="w-full bg-white dark:bg-slate-950">
                            <SelectValue placeholder="Semua Prioritas" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Prioritas</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
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
