import { Loader2, Search, X } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useEffect } from "react";

export default function SearchInput({
  search,
  setSearch,
  isLoading,
  setPage,
  placeholder = "Search…",
}: {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  placeholder?: string;
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearch("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [setSearch]);

  return (
    <div className="flex items-center gap-2 w-full border border-input rounded-md px-3 bg-white dark:bg-card focus-within:ring-2 focus-within:ring-ring/50 focus-within:border-ring">
      <Label aria-hidden>
        {isLoading && search ? (
          <Loader2 className="animate-spin h-4 w-4 text-gray-500" />
        ) : (
          <Search className="h-4 w-4 text-gray-500" />
        )}
      </Label>
      <Input
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        placeholder={placeholder}
        className="w-full border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 shadow-none h-8 bg-card!"
      />
      {search && (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSearch("")}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
          <span className="text-xs text-gray-400">ESC</span>
        </div>
      )}
    </div>
  );
}
