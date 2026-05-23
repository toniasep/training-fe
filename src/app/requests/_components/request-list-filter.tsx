import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface RequestListFilterProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
}

export const RequestListFilter = ({ searchQuery, onSearchChange }: RequestListFilterProps) => {
    return (
        <section aria-label="Filter Request" className="mb-6">
            <form className="relative w-full md:w-80" onSubmit={(e) => e.preventDefault()}>
                <label htmlFor="search-request" className="sr-only">Cari request</label>
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                    <Search className="h-4 w-4" />
                </div>
                <Input
                    aria-label="Search request"
                    id="search-request"
                    type="search"
                    placeholder="Cari request..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-10 bg-white"
                />
            </form>
        </section>
    );
};
