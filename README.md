# AI Movie Insight Builder

A modern full-stack web application that generates **deep audience insights and movie information** using real user reviews and AI-powered sentiment analysis.

Users can enter an **IMDb ID** (e.g. `tt0133093`) and instantly receive a detailed movie profile along with an analysis of audience sentiment.

---

# Project Overview

The **AI Movie Insight Builder** is designed to combine movie metadata, real audience reviews, and AI analysis into a single interactive interface.

The application fetches movie information from **OMDb**, retrieves audience reviews from **TMDB**, and then processes those reviews to determine the overall **audience sentiment (Positive / Mixed / Negative)**.

This provides users with both **factual movie information and summarized audience insights**.

---

# Core Features

### Movie Information Retrieval
- Fetches movie details using the **OMDb API**
- Displays:
  - Movie title
  - Poster
  - Cast
  - Release year
  - IMDb rating
  - Plot summary

### Audience Review Analysis
- Retrieves audience reviews using the **TMDB API**
- Automatically maps IMDb IDs to TMDB movie IDs
- Extracts multiple audience reviews for analysis

### AI Sentiment Insights
- Reviews are analyzed using AI-based sentiment logic
- Generates:
  - A **short audience summary**
  - An overall **sentiment classification**

Sentiment categories:


Positive 👍
Mixed 😐
Negative 👎


### Modern UI / UX
- Responsive dark-themed interface
- Smooth loading animations
- Clear error handling
- Interactive search experience

### Validation & Error Handling
- IMDb ID format validation
- Graceful API error handling
- Clear user feedback

---

# Tech Stack

### Frontend
- **Next.js (App Router)**
- **React**
- **TypeScript**
- **Tailwind CSS**

### Backend
- **Next.js API Routes**

### External APIs
- **OMDb API** – movie metadata
- **TMDB API** – audience reviews

### Libraries
- **Lucide React** – icons
- **Framer Motion / Tailwind Animate** – UI animations

---

# System Architecture

The application follows a simple full-stack architecture:


User Input (IMDb ID)
│
▼
Frontend (Next.js)
│
▼
API Route (/api/movie)
│
├── OMDb API → Movie details
│
├── TMDB API → Audience reviews
│
▼
Sentiment Analysis Engine
│
▼
Structured Response
│
▼
UI Rendering


---

# Project Structure


src
├── app
│ ├── api
│ │ └── movie
│ │ └── route.ts
│ └── page.tsx
│
├── components
│ ├── MovieCard.tsx
│ ├── SearchBar.tsx
│ └── SentimentBox.tsx
│
└── lib
├── sentiment.ts
├── omdb.ts
└── tmdb.ts


---

# Setup Instructions

## 1. Clone the Repository


git clone https://github.com/YOUR_USERNAME/ai-movie-insight-builder.git

cd ai-movie-insight-builder


## 2. Install Dependencies


npm install


## 3. Configure Environment Variables

Create a file in the root directory:


.env.local


Add the following keys:


OMDB_API_KEY=your_omdb_key
TMDB_API_KEY=your_tmdb_key


These keys are required for retrieving movie details and reviews.

---

# Running the Application

Start the development server:


npm run dev


Open the app in your browser:


http://localhost:3000


Example IMDb IDs for testing:


tt0133093 → The Matrix
tt1375666 → Inception
tt0816692 → Interstellar
tt0468569 → The Dark Knight


---

# Deployment (Vercel)

This project is designed to be easily deployed using **Vercel**.

### Steps

1. Push the project to GitHub
2. Go to **https://vercel.com**
3. Import the GitHub repository
4. Add environment variables:


OMDB_API_KEY
TMDB_API_KEY


5. Click **Deploy**

Vercel will automatically build and deploy the application.

---

# Assumptions

- The IMDb ID follows the format:


tt + numeric digits


Example:


tt0133093


- The TMDB **Find API endpoint** is used to map IMDb IDs to TMDB movie IDs.

- Sentiment analysis requires **sufficient review text** to generate meaningful insights.

---

# Future Improvements

Possible enhancements for future versions:

- Real AI sentiment analysis using **OpenAI / LLMs**
- More advanced **review summarization**
- **Movie recommendations** based on sentiment
- Review **visualization charts**
- **Caching** for faster API responses
- Support for **TV Shows**

---

# Author

Built as part of a **Full-Stack Developer Internship Assignment**.

Developer: **Dheeraj Bansal**

---