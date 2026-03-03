export async function getMovieDetails(imdbId: string) {
  const omdbKey = process.env.OMDB_API_KEY;
  if (!omdbKey) {
    throw new Error("OMDB_API_KEY is missing");
  }

  const response = await fetch(`https://www.omdbapi.com/?i=${imdbId}&apikey=${omdbKey}`);
  const data = await response.json();

  if (data.Response === "False") {
    return null;
  }

  return {
    title: data.Title || "Unknown",
    poster: data.Poster !== "N/A" ? data.Poster : "",
    cast: data.Actors || "N/A",
    releaseYear: data.Year || "N/A",
    imdbRating: data.imdbRating || "N/A",
    plot: data.Plot || "N/A",
  };
}
