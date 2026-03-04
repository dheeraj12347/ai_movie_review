import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id || !/^tt\d+$/.test(id)) {
    return NextResponse.json(
      { message: "Invalid IMDb ID. Must start with 'tt' followed by digits." },
      { status: 400 }
    );
  }

  try {
    /* =========================
       1. FETCH MOVIE FROM OMDB
    ==========================*/

    const omdbKey = process.env.OMDB_API_KEY;

    if (!omdbKey) {
      throw new Error("OMDB_API_KEY missing");
    }

    const omdbRes = await fetch(
      `https://www.omdbapi.com/?i=${id}&apikey=${omdbKey}`
    );

    const omdbData = await omdbRes.json();

    if (omdbData.Response === "False") {
      return NextResponse.json(
        { message: "Movie not found on OMDb." },
        { status: 404 }
      );
    }

    /* =========================
       2. FETCH REVIEWS FROM TMDB
    ==========================*/

    const tmdbKey = process.env.TMDB_API_KEY;

    if (!tmdbKey) {
      throw new Error("TMDB_API_KEY missing");
    }

    const tmdbFindRes = await fetch(
      `https://api.themoviedb.org/3/find/${id}?external_source=imdb_id&api_key=${tmdbKey}`
    );

    const tmdbFindData = await tmdbFindRes.json();
    const tmdbMovie = tmdbFindData.movie_results?.[0];

    let reviews: string[] = [];
    let reviewCount = 0;

    if (tmdbMovie) {
      const reviewsRes = await fetch(
        `https://api.themoviedb.org/3/movie/${tmdbMovie.id}/reviews?api_key=${tmdbKey}`
      );

      const reviewsData = await reviewsRes.json();

      reviews = (reviewsData.results || [])
        .map((r: any) => r.content)
        .filter((text: string) => text && text.length > 20)
        .slice(0, 8);

      reviewCount = reviews.length;
    }

    /* =========================
       3. SENTIMENT ANALYSIS
    ==========================*/

    let sentimentSummary =
      "Audience reactions are mixed, with viewers expressing both praise and criticism about the film.";

    let sentimentClassification: "positive" | "mixed" | "negative" = "mixed";

    if (reviews.length > 0) {
      const text = reviews.join(" ").toLowerCase();

      const positiveWords = [
        "great",
        "amazing",
        "excellent",
        "love",
        "masterpiece",
        "fantastic",
        "good",
        "brilliant",
        "awesome",
      ];

      const negativeWords = [
        "bad",
        "boring",
        "terrible",
        "slow",
        "confusing",
        "disappointing",
        "waste",
        "poor",
      ];

      let score = 0;

      positiveWords.forEach((word) => {
        if (text.includes(word)) score++;
      });

      negativeWords.forEach((word) => {
        if (text.includes(word)) score--;
      });

      if (score > 1) {
        sentimentClassification = "positive";
      } else if (score < -1) {
        sentimentClassification = "negative";
      } else {
        sentimentClassification = "mixed";
      }

      if (sentimentClassification === "positive") {
        sentimentSummary =
          "Audience reactions are largely positive, with many viewers praising the performances, visuals, and storytelling.";
      }

      if (sentimentClassification === "negative") {
        sentimentSummary =
          "Audience reactions are mostly negative, with viewers criticizing aspects such as pacing, story issues, or overall execution.";
      }
    }

    /* =========================
       4. RETURN RESULT
    ==========================*/

    const result = {
      details: {
        title: omdbData.Title || "Unknown",
        poster: omdbData.Poster !== "N/A" ? omdbData.Poster : "",
        cast: omdbData.Actors || "N/A",
        releaseYear: omdbData.Year || "N/A",
        imdbRating: omdbData.imdbRating || "N/A",
        plot: omdbData.Plot || "N/A",
      },

      sentiment: {
        summary: sentimentSummary,
        classification: sentimentClassification,
        reviewCount: reviewCount,
      },
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("API Error:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}