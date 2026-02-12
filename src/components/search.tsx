import { Input } from "@/components/ui/input"
import { Search as SearchIcon } from "lucide-react"

export function Search() {
    return (
        <div className="relative">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                type="search"
                placeholder="Search..."
                className="w-full pl-8 md:w-[100px] lg:w-[300px] bg-muted/50 border-none h-9"
            />
        </div>
    )
}
