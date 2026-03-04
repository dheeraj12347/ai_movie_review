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
                  content: `You are an AI movie review analyst.

Your task is to analyze audience reviews of a movie and extract overall audience sentiment.

You will receive several user reviews written by different viewers.

Instructions:

1. Read all reviews carefully.
2. Identify the overall audience sentiment.
3. Classify the sentiment into one of the following:
   - positive
   - mixed
   - negative

4. Write a short summary (3–4 sentences) explaining:
   - what audiences liked
   - what audiences disliked
   - the overall perception of the movie.

Important rules:

- Be objective and concise.
- Focus only on audience opinions from the reviews.
- Do not invent information that is not present in the reviews.
- If reviews are mostly positive but contain some criticism, classify as "mixed".

Return your answer in this exact JSON format:

{
  "summary": "string",
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
      }
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
