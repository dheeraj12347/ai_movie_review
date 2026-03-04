import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id || !/^tt\d+$/.test(id)) {
    return NextResponse.json({ message: "Invalid IMDb ID. Must start with 'tt' followed by digits." }, { status: 400 });
  }

  try {
    // 1) OMDb API → Movie details
    const omdbKey = process.env.OMDB_API_KEY;
    if (!omdbKey) {
      throw new Error("OMDB_API_KEY is missing");
    }

    const omdbResponse = await fetch(`https://www.omdbapi.com/?i=${id}&apikey=${omdbKey}`);
    const omdbData = await omdbResponse.json();

    if (omdbData.Response === "False") {
      return NextResponse.json({ message: "Movie not found on OMDb" }, { status: 404 });
    }

    // 2) TMDB API → Reviews
    const tmdbKey = process.env.TMDB_API_KEY;
    if (!tmdbKey) {
      throw new Error("TMDB_API_KEY is missing");
    }

    const tmdbFindResponse = await fetch(`https://api.themoviedb.org/3/find/${id}?external_source=imdb_id&api_key=${tmdbKey}`);
    const tmdbFindData = await tmdbFindResponse.json();
    const tmdbMovie = tmdbFindData.movie_results?.[0];

    let allReviewsText = "";
    if (tmdbMovie) {
      const reviewsResponse = await fetch(`https://api.themoviedb.org/3/movie/${tmdbMovie.id}/reviews?api_key=${tmdbKey}`);
      const reviewsData = await reviewsResponse.json();
      const reviews = reviewsData.results || [];
      allReviewsText = reviews.slice(0, 5).map((r: any) => r.content).join("\n\n");
    }

    // 3) OpenAI API → Sentiment summary
    let sentimentSummary = "No sufficient audience reviews found to generate sentiment.";
    let sentimentClassification: "positive" | "mixed" | "negative" = "mixed";
    let reviewCount = 0;

    if (tmdbMovie) {
      const reviewsResponse = await fetch(`https://api.themoviedb.org/3/movie/${tmdbMovie.id}/reviews?api_key=${tmdbKey}`);
      const reviewsData = await reviewsResponse.json();
      const reviews = reviewsData.results || [];
      reviewCount = reviews.length;
      allReviewsText = reviews.slice(0, 5).map((r: any) => r.content).join("\n\n");
    }

    if (allReviewsText.length > 50) {
      try {
        const openaiApiKey = process.env.AI_INTEGRATIONS_OPENAI_API_KEY;
        const openaiBaseUrl = process.env.AI_INTEGRATIONS_OPENAI_BASE_URL;

        if (openaiApiKey && openaiBaseUrl) {
          const completion = await fetch(`${openaiBaseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${openaiApiKey}`
            },
            body: JSON.stringify({
              model: "gpt-4o",
              messages: [
                {
                  role: "system",
                  content: `You are an AI movie review analyst. Analyze the audience reviews and determine the overall sentiment.

Tasks:
1. Identify common audience opinions.
2. Summarize the overall reception in 3–4 concise sentences.
3. Classify the overall sentiment into one of the following:
   positive
   mixed
   negative

Return your answer strictly in JSON format:

{
  "summary": "3-4 sentence audience insight summary",
  "sentiment": "positive | mixed | negative"
}`
                },
                {
                  role: "user",
                  content: allReviewsText
                }
              ],
              response_format: { type: "json_object" }
            })
          });

          if (completion.ok) {
            const data = await completion.json();
            const parsedContent = JSON.parse(data.choices[0]?.message?.content || "{}");
            sentimentSummary = parsedContent.summary || sentimentSummary;
            const c = (parsedContent.sentiment || parsedContent.classification)?.toLowerCase();
            if (["positive", "mixed", "negative"].includes(c)) {
              sentimentClassification = c as any;
            }
          }
        }
      } catch (e) {
        console.error("OpenAI Error:", e);
        sentimentSummary = "Error generating sentiment summary.";
      }
    }

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
        reviewCount: reviewCount
      }
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
