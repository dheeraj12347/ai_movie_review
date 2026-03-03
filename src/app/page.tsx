"use client";

import { useState } from "react";
import { SearchBar } from "@/components/SearchBar";
import { MovieCard } from "@/components/MovieCard";
import { SentimentBox } from "@/components/SentimentBox";
import { Film } from "lucide-react";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const handleSearch = async (imdbId: string) => {
    setLoading(true);
    setData(null);
    try {
      const res = await fetch(`/api/movie?id=${imdbId}`);
      if (!res.ok) {
        throw new Error(await res.text());
      }
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch movie details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl flex flex-col items-center space-y-12">
        
        {/* Header Header Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-4 bg-blue-500/10 rounded-full mb-4 ring-1 ring-blue-500/20">
            <Film className="w-10 h-10 text-blue-400" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            AI Movie Insight Builder
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Discover deep audience insights and rich movie details instantly using the power of AI. Enter an IMDb ID below to get started.
          </p>
        </div>

        {/* Search Section */}
        <div className="w-full max-w-2xl">
          <SearchBar onSearch={handleSearch} isLoading={loading} />
        </div>

        {/* Results Section */}
        <div className="w-full flex flex-col items-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {(loading || data) && (
            <MovieCard movie={data?.details || null} isLoading={loading} />
          )}
          {(loading || data) && (
             <SentimentBox sentiment={data?.sentiment || null} isLoading={loading} />
          )}
        </div>

      </div>
    </main>
  );
}
