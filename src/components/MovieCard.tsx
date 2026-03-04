import { cn } from "@/lib/utils";
import React from "react";
import { Loader2 } from "lucide-react";

export interface MovieDetails {
  title: string;
  poster: string;
  cast: string;
  releaseYear: string;
  imdbRating: string;
  plot: string;
}

export function MovieCard({ movie, isLoading }: { movie: MovieDetails | null; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="w-full max-w-2xl rounded-xl border border-white/10 bg-white/5 p-6 animate-pulse">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="w-full sm:w-[200px] aspect-[2/3] bg-white/10 rounded-lg"></div>
          <div className="flex-1 space-y-4">
            <div className="h-8 bg-white/10 rounded w-3/4"></div>
            <div className="h-4 bg-white/10 rounded w-1/4"></div>
            <div className="h-4 bg-white/10 rounded w-1/2"></div>
            <div className="space-y-2 mt-4">
              <div className="h-4 bg-white/10 rounded w-full"></div>
              <div className="h-4 bg-white/10 rounded w-full"></div>
              <div className="h-4 bg-white/10 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!movie) return null;

  return (
    <div className="w-full max-w-2xl rounded-xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/10 group">
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="w-full sm:w-[200px] shrink-0">
          {movie.poster ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={movie.poster} 
              alt={`${movie.title} poster`} 
              className="w-full h-auto rounded-lg shadow-lg object-cover aspect-[2/3]"
            />
          ) : (
            <div className="w-full aspect-[2/3] bg-white/10 flex items-center justify-center rounded-lg">
              <span className="text-white/40 text-sm">No Poster</span>
            </div>
          )}
        </div>
        <div className="flex-1 flex flex-col">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight">
            {movie.title} <span className="text-white/50 font-normal">({movie.releaseYear})</span>
          </h2>
          
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-yellow-500/10 text-yellow-500 font-medium text-sm border border-yellow-500/20">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {movie.imdbRating}
            </span>
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-1">Cast</h3>
            <p className="text-white/80 text-sm leading-relaxed">{movie.cast}</p>
          </div>

          <div className="flex-1">
            <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-1">Plot</h3>
            <p className="text-white/80 text-sm leading-relaxed">{movie.plot}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
