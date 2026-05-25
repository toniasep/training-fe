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

interface AuditLogFilterProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    actorFilter: string;
    onActorChange: (value: string) => void;
    actionFilter: string;
    onActionChange: (value: string) => void;
    onReset: () => void;
    isFiltered: boolean;
    uniqueActors: string[];
    uniqueActions: string[];
}

export const AuditLogFilter = ({
    searchQuery,
    onSearchChange,
    actorFilter,
    onActorChange,
    actionFilter,
    onActionChange,
    onReset,
    isFiltered,
    uniqueActors,
    uniqueActions,
}: AuditLogFilterProps) => {
    return (
        <section aria-label="Filter Audit Logs" className="mb-6 flex flex-col md:flex-row gap-3 items-end md:items-center w-full">
            {/* Search Input for Details */}
            <div className="relative flex-1 max-w-xs w-full">
                <label htmlFor="search-details" className="sr-only">Cari detail aktivitas</label>
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                    <Search className="h-4 w-4" />
                </div>
                <Input
                    aria-label="Search details"
                    id="search-details"
                    type="search"
                    placeholder="Cari detail aktivitas..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-10 bg-white dark:bg-slate-950"
                />
            </div>

            <div className="flex flex-wrap gap-3 w-full md:w-auto">
                {/* Select Filter for Action */}
                <div className="w-48">
                    <Select value={actionFilter || "all"} onValueChange={(val) => onActionChange(val === "all" ? "" : val)}>
                        <SelectTrigger className="w-full bg-white dark:bg-slate-950">
                            <SelectValue placeholder="Semua Aksi" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Aksi</SelectItem>
                            {uniqueActions.map((action) => (
                                <SelectItem key={action} value={action}>
                                    {action}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Select Filter for Actor */}
                <div className="w-64">
                    <Select value={actorFilter || "all"} onValueChange={(val) => onActorChange(val === "all" ? "" : val)}>
                        <SelectTrigger className="w-full bg-white dark:bg-slate-950">
                            <SelectValue placeholder="Semua Aktor" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Aktor</SelectItem>
                            {uniqueActors.map((actor) => (
                                <SelectItem key={actor} value={actor}>
                                    {actor}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Reset Filters Button */}
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
