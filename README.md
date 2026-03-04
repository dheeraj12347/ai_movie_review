# AI Movie Insight Builder

A modern, full-stack application that provides deep audience insights and detailed information about movies using AI.

## Project Overview

The AI Movie Insight Builder allows users to input an IMDb ID and instantly receive a comprehensive movie profile. This includes movie details (title, cast, plot, etc.) and an AI-generated sentiment analysis based on real audience reviews from TMDB.

## Features

- **Movie Data**: Fetches detailed movie information from OMDb API.
- **Audience Reviews**: Retrieves the latest viewer feedback from TMDB API.
- **AI Sentiment Analysis**: Uses OpenAI (GPT-4o) to analyze reviews and categorize audience sentiment (Positive, Mixed, Negative).
- **Modern UI**: Polished dark-themed design with responsive layouts and subtle animations.
- **Validation**: Strict IMDb ID validation and robust error handling.
- **Loading States**: Clear visual feedback while fetching data and analyzing sentiment.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: OpenAI API (GPT-4o)
- **External APIs**: OMDb API, TMDB API
- **Icons**: Lucide React
- **Animations**: Framer Motion & Tailwind Animate

## Setup Instructions

1.  **Clone the repository**
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Configure Environment Variables**:
    Create a `.env.local` file in the root directory and add the following:
    ```env
    OMDB_API_KEY=your_omdb_key
    TMDB_API_KEY=your_tmdb_key
    # Replit handles AI_INTEGRATIONS_OPENAI_BASE_URL and AI_INTEGRATIONS_OPENAI_API_KEY automatically.
    # For local dev, use standard OPENAI_API_KEY if needed.
    ```
4.  **Run the development server**:
    ```bash
    npm run dev
    ```

## Deployment Instructions (Vercel)

1.  Push your code to a GitHub repository.
2.  Import the project into [Vercel](https://vercel.com).
3.  Add the environment variables (`OMDB_API_KEY`, `TMDB_API_KEY`, etc.) in the Vercel project settings.
4.  Deploy!

## Assumptions

- The IMDb ID provided by the user is in the format `tt` followed by digits.
- The TMDB API find endpoint is used to map IMDb IDs to TMDB IDs for review retrieval.
- AI analysis requires a minimum amount of review text to provide meaningful insights.
