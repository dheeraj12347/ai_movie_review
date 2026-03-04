"use client";

import { useState } from "react";
import { SearchBar } from "@/components/SearchBar";
import { MovieCard, type MovieDetails } from "@/components/MovieCard";
import { SentimentBox, type SentimentAnalysis } from "@/components/SentimentBox";
import { Film, Loader2 } from "lucide-react";

interface MovieInsight {
  details: MovieDetails;
  sentiment: SentimentAnalysis;
}

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [data, setData] = useState<MovieInsight | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (imdbId: string) => {
    // ✅ Prevent multiple searches while one is already running
    if (loading) return;

    setLoading(true);
    setError(null);
    setData(null);
    setLoadingMessage("Fetching movie details...");

    try {
      const sentimentTimer = setTimeout(() => {
        setLoadingMessage("Analyzing audience sentiment with AI...");
      }, 1500);

      const res = await fetch(`/api/movie?id=${imdbId}`);
      clearTimeout(sentimentTimer);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({
          message: "Temporary server issue. Please try again.",
        }));

        console.warn("API Error:", errorData);

        setError(
          errorData.message || "Temporary server issue. Please try again."
        );
        setLoading(false);
        return;
      }

      const json: MovieInsight = await res.json();
      setData(json);
    } catch (err: any) {
      console.error("Fetch Error:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="w-full max-w-4xl flex flex-col items-center space-y-12">

        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-4 bg-blue-500/10 rounded-full mb-4 ring-1 ring-blue-500/20">
            <Film className="w-10 h-10 text-blue-400" />
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            AI Movie Insight Builder
          </h1>

          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Discover deep audience insights and rich movie details instantly
            using the power of AI. Enter an IMDb ID below to get started.
          </p>
        </div>

        {/* Search Section */}
        <div className="w-full max-w-2xl">
          <SearchBar onSearch={handleSearch} isLoading={loading} />

          {loading && (
            <div className="mt-8 flex flex-col items-center gap-3 animate-in fade-in duration-300">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />

              <p className="text-blue-400 font-medium text-sm tracking-wide animate-pulse">
                {loadingMessage}
              </p>
            </div>
          )}

          {error && !loading && (
            <div className="mt-8 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-center animate-in zoom-in-95 duration-300">
              <p className="font-medium">{error}</p>
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="w-full flex flex-col items-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {!loading && data && (
            <>
              <MovieCard movie={data?.details || null} isLoading={false} />
              <SentimentBox sentiment={data?.sentiment || null} isLoading={false} />
            </>
          )}
        </div>

      </div>
    </main>
  );
}