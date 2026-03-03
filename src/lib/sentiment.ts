interface SentimentResult {
  summary: string;
  classification: "positive" | "mixed" | "negative";
}

export async function generateSentiment(reviewsText: string, openaiBaseUrl?: string, openaiApiKey?: string): Promise<SentimentResult> {
  let sentimentSummary = "No sufficient audience reviews found to generate sentiment.";
  let sentimentClassification: "positive" | "mixed" | "negative" = "mixed";

  if (!reviewsText || reviewsText.length < 50) {
    return { summary: sentimentSummary, classification: sentimentClassification };
  }

  if (!openaiApiKey || !openaiBaseUrl) {
    console.warn("OpenAI integration missing. Returning default sentiment.");
    return { summary: sentimentSummary, classification: sentimentClassification };
  }

  try {
    const completion = await fetch(`${openaiBaseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        model: "gpt-5.1",
        messages: [
          {
            role: "system",
            content: `You are an expert movie critic analyst. Summarize the following audience reviews into a 2-3 sentence engaging summary.
Also classify the overall sentiment as strictly one of these three exact words: "positive", "mixed", or "negative".
Return the response in JSON format like this:
{
  "summary": "The audience generally loved the thrilling action sequences...",
  "classification": "positive"
}`
          },
          {
            role: "user",
            content: reviewsText
          }
        ],
        response_format: { type: "json_object" }
      })
    });

    if (completion.ok) {
      const data = await completion.json();
      const parsedContent = JSON.parse(data.choices[0]?.message?.content || "{}");
      sentimentSummary = parsedContent.summary || sentimentSummary;
      const c = parsedContent.classification?.toLowerCase();
      if (["positive", "mixed", "negative"].includes(c)) {
        sentimentClassification = c as any;
      }
    }
  } catch (e) {
    console.error("OpenAI Error:", e);
    sentimentSummary = "Error generating sentiment summary.";
  }

  return {
    summary: sentimentSummary,
    classification: sentimentClassification
  };
}

export function classifySentimentFromText(text: string): "positive" | "mixed" | "negative" {
  // A simple deterministic fallback or utility for tests
  const lower = text.toLowerCase();
  if (lower.includes("positive")) return "positive";
  if (lower.includes("negative")) return "negative";
  return "mixed";
}
