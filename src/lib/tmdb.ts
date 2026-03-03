export async function getMovieReviews(imdbId: string) {
  const tmdbKey = process.env.TMDB_API_KEY;
  if (!tmdbKey) {
    throw new Error("TMDB_API_KEY is missing");
  }

  // Find the TMDB internal ID using the external IMDb ID
  const findResponse = await fetch(`https://api.themoviedb.org/3/find/${imdbId}?external_source=imdb_id&api_key=${tmdbKey}`);
  const findData = await findResponse.json();
  const movie = findData.movie_results?.[0];

  if (!movie) {
    return "";
  }

  const reviewsResponse = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}/reviews?api_key=${tmdbKey}`);
  const reviewsData = await reviewsResponse.json();
  const reviews = reviewsData.results || [];
  
  // Combine top 5 reviews
  return reviews.slice(0, 5).map((r: any) => r.content).join("\n\n");
}
