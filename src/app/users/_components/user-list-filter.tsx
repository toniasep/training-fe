import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface UserListFilterProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
}

export const UserListFilter = ({ searchQuery, onSearchChange }: UserListFilterProps) => {
    return (
        <section aria-label="Filter User" className="mb-6">
            <form className="relative w-full md:w-80" onSubmit={(e) => e.preventDefault()}>
                <label htmlFor="search-user" className="sr-only">Cari user</label>
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                    <Search className="h-4 w-4" />
                </div>
                <Input
                    aria-label="Search user"
                    id="search-user"
                    type="search"
                    placeholder="Cari user..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-10 bg-white"
                />
            </form>
        </section>
    );
};
