"use client";

import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  onSearch: (imdbId: string) => void;
  isLoading: boolean;
}

export function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmed = value.trim();
    if (!trimmed) {
      setError("Please enter an IMDb ID.");
      return;
    }

    if (!/^tt\d+$/.test(trimmed)) {
      setError("Please enter a valid IMDb ID (example: tt0133093)");
      return;
    }

    onSearch(trimmed);
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-white/40 group-focus-within:text-white/80 transition-colors" />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter IMDb ID (e.g. tt0133093)..."
          className={cn(
            "w-full bg-white/5 border border-white/10 rounded-full py-3.5 pl-12 pr-14",
            "text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all",
            "text-base md:text-lg"
          )}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !value.trim()}
          className={cn(
            "absolute inset-y-1.5 right-1.5 px-4 rounded-full font-medium text-sm transition-all",
            "bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50 disabled:cursor-not-allowed",
            "flex items-center justify-center"
          )}
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
        </button>
      </form>
      {error && (
        <p className="mt-2 text-red-400 text-sm pl-4 animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
}
