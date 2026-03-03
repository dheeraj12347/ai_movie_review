import { cn } from "@/lib/utils";
import { ThumbsUp, ThumbsDown, Minus, Sparkles } from "lucide-react";

export interface SentimentAnalysis {
  summary: string;
  classification: "positive" | "mixed" | "negative";
}

export function SentimentBox({ sentiment, isLoading }: { sentiment: SentimentAnalysis | null; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="w-full max-w-2xl rounded-xl border border-white/10 bg-white/5 p-6 mt-4 animate-pulse">
        <div className="h-5 w-32 bg-white/10 rounded mb-4"></div>
        <div className="space-y-2">
          <div className="h-4 w-full bg-white/10 rounded"></div>
          <div className="h-4 w-5/6 bg-white/10 rounded"></div>
        </div>
      </div>
    );
  }

  if (!sentiment) return null;

  const classificationConfig = {
    positive: {
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      icon: ThumbsUp,
      label: "Positive Reception"
    },
    mixed: {
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      icon: Minus,
      label: "Mixed Reception"
    },
    negative: {
      color: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
      icon: ThumbsDown,
      label: "Negative Reception"
    }
  };

  const config = classificationConfig[sentiment.classification];
  const Icon = config.icon;

  return (
    <div className="w-full max-w-2xl mt-4 relative overflow-hidden">
      {/* Decorative gradient background based on sentiment */}
      <div className={cn(
        "absolute inset-0 opacity-20 blur-2xl",
        sentiment.classification === 'positive' ? "bg-emerald-500/20" :
        sentiment.classification === 'negative' ? "bg-red-500/20" : "bg-amber-500/20"
      )} />
      
      <div className={cn(
        "relative rounded-xl border p-6 shadow-xl backdrop-blur-sm transition-all duration-300",
        config.bg,
        config.border
      )}>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className={cn("w-5 h-5", config.color)} />
          <h3 className={cn("text-sm font-bold uppercase tracking-wider", config.color)}>
            AI Audience Insight
          </h3>
        </div>
        
        <p className="text-white/90 text-base leading-relaxed md:text-lg mb-4 font-medium">
          "{sentiment.summary}"
        </p>

        <div className="flex items-center">
          <span className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold",
            config.bg, config.color, "border border-current/20"
          )}>
            <Icon className="w-4 h-4" />
            {config.label}
          </span>
        </div>
      </div>
    </div>
  );
}
