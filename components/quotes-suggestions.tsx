"use client"

import { useState, useEffect } from "react"
import { Card } from "./ui/card"
import { Button } from "./ui/button"
import { RefreshCw, Heart } from "lucide-react"

const DAILY_QUOTES = [
  {
    text: "The only way out is through. Take it one step at a time.",
    author: "Robert Frost",
    category: "perseverance",
  },
  {
    text: "You don't have to see the whole staircase, just take the first step.",
    author: "Martin Luther King Jr.",
    category: "courage",
  },
  {
    text: "Healing doesn't mean the damage never existed. It means the damage no longer controls our lives.",
    author: "Akshay Dubey",
    category: "healing",
  },
  {
    text: "Be patient with yourself. You're doing better than you think.",
    author: "Unknown",
    category: "self-compassion",
  },
  {
    text: "Your mental health is a priority, not a luxury.",
    author: "Unknown",
    category: "self-care",
  },
  {
    text: "Progress is progress, no matter how small.",
    author: "Unknown",
    category: "growth",
  },
  {
    text: "You are not alone in this. Reach out when you need help.",
    author: "Unknown",
    category: "connection",
  },
  {
    text: "Difficult roads often lead to beautiful destinations.",
    author: "Unknown",
    category: "hope",
  },
  {
    text: "Your voice matters. Your feelings are valid.",
    author: "Unknown",
    category: "validation",
  },
  {
    text: "Mistakes don't make you broken, they make you human.",
    author: "Unknown",
    category: "acceptance",
  },
]

const WELLNESS_TIPS = [
  {
    title: "Practice Deep Breathing",
    description: "Try the 4-7-8 technique: Breathe in for 4 counts, hold for 7, exhale for 8.",
    category: "breathing",
    emoji: "🫁",
  },
  {
    title: "Take a Break",
    description: "Step away from screens for 10 minutes. Go for a short walk or get some fresh air.",
    category: "breaks",
    emoji: "🚶",
  },
  {
    title: "Practice Gratitude",
    description: "Write down 3 things you're grateful for today, no matter how small.",
    category: "gratitude",
    emoji: "🙏",
  },
  {
    title: "Move Your Body",
    description: "Do 10 minutes of stretching, yoga, or any physical activity you enjoy.",
    category: "movement",
    emoji: "🧘",
  },
  {
    title: "Connect with Someone",
    description: "Text a friend or family member. Reach out to someone you trust.",
    category: "connection",
    emoji: "🤝",
  },
  {
    title: "Journaling",
    description: "Write down your thoughts and feelings without judgment. Let it flow naturally.",
    category: "journaling",
    emoji: "📓",
  },
  {
    title: "Listen to Music",
    description: "Play your favorite calming or uplifting playlist.",
    category: "music",
    emoji: "🎵",
  },
  {
    title: "Hydrate & Nourish",
    description: "Drink water and eat something healthy. Taking care of your body matters.",
    category: "nutrition",
    emoji: "🥗",
  },
]

interface QuotesSuggestionsProps {
  ageGroup?: string
}

export default function QuotesSuggestions({ ageGroup = "early-adult" }: QuotesSuggestionsProps) {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0)
  const [currentTipIndex, setCurrentTipIndex] = useState(0)
  const [favoriteQuotes, setFavoriteQuotes] = useState<number[]>([])

  useEffect(() => {
    // Randomize initial quote and tip
    setCurrentQuoteIndex(Math.floor(Math.random() * DAILY_QUOTES.length))
    setCurrentTipIndex(Math.floor(Math.random() * WELLNESS_TIPS.length))
  }, [])

  const currentQuote = DAILY_QUOTES[currentQuoteIndex]
  const currentTip = WELLNESS_TIPS[currentTipIndex]

  const handleNextQuote = () => {
    setCurrentQuoteIndex((prev) => (prev + 1) % DAILY_QUOTES.length)
  }

  const handleNextTip = () => {
    setCurrentTipIndex((prev) => (prev + 1) % WELLNESS_TIPS.length)
  }

  const toggleFavorite = (index: number) => {
    setFavoriteQuotes((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  return (
    <div className="space-y-6">
      {/* Daily Motivational Quote */}
      <Card className="p-6 border-0 shadow-sm bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Today's Inspiration</h3>
          <Button onClick={() => toggleFavorite(currentQuoteIndex)} variant="ghost" size="sm" className="rounded-full">
            <Heart
              className={`w-5 h-5 ${
                favoriteQuotes.includes(currentQuoteIndex) ? "fill-accent text-accent" : "text-muted-foreground"
              }`}
            />
          </Button>
        </div>

        <div className="mb-6">
          <p className="text-lg italic text-foreground leading-relaxed mb-4">"{currentQuote.text}"</p>
          <p className="text-sm text-muted-foreground text-right">— {currentQuote.author}</p>
          <div className="mt-2">
            <span className="inline-block px-3 py-1 bg-accent/20 text-accent text-xs font-medium rounded-full">
              {currentQuote.category}
            </span>
          </div>
        </div>

        <Button onClick={handleNextQuote} variant="outline" className="w-full rounded-lg bg-transparent gap-2">
          <RefreshCw className="w-4 h-4" />
          Next Inspiration
        </Button>
      </Card>

      {/* Wellness Tip of the Day */}
      <Card className="p-6 border-0 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground mb-4">Wellness Tip of the Day</h3>

        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <span className="text-3xl">{currentTip.emoji}</span>
            <div className="flex-1">
              <h4 className="font-semibold text-foreground mb-1">{currentTip.title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed mb-2">{currentTip.description}</p>
              <span className="inline-block px-2 py-1 bg-secondary/30 text-foreground text-xs font-medium rounded">
                {currentTip.category}
              </span>
            </div>
          </div>
        </div>

        <Button onClick={handleNextTip} variant="outline" className="w-full mt-4 rounded-lg bg-transparent gap-2">
          <RefreshCw className="w-4 h-4" />
          Another Tip
        </Button>
      </Card>

      {/* Quick Actions */}
      <Card className="p-6 border-0 shadow-sm bg-secondary/20">
        <h3 className="text-lg font-semibold text-foreground mb-4">Quick Mental Health Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="rounded-lg bg-background/80 h-16 flex flex-col gap-1">
            <span className="text-lg">🧘</span>
            <span className="text-xs font-medium">Meditate</span>
          </Button>
          <Button variant="outline" className="rounded-lg bg-background/80 h-16 flex flex-col gap-1">
            <span className="text-lg">📔</span>
            <span className="text-xs font-medium">Journal</span>
          </Button>
          <Button variant="outline" className="rounded-lg bg-background/80 h-16 flex flex-col gap-1">
            <span className="text-lg">🎵</span>
            <span className="text-xs font-medium">Listen</span>
          </Button>
          <Button variant="outline" className="rounded-lg bg-background/80 h-16 flex flex-col gap-1">
            <span className="text-lg">🤝</span>
            <span className="text-xs font-medium">Reach Out</span>
          </Button>
        </div>
      </Card>

      {/* Resources */}
      <Card className="p-6 border-0 shadow-sm bg-accent/10">
        <h3 className="text-lg font-semibold text-foreground mb-3">Need Support?</h3>
        <p className="text-sm text-foreground mb-4">
          If you're struggling, remember that help is always available. You're not alone in this.
        </p>
        <div className="space-y-2 text-sm">
          <p className="text-foreground">
            <span className="font-semibold">Crisis Resources:</span>
          </p>
          <ul className="text-muted-foreground space-y-1 ml-2">
            <li>• National Mental Health Helpline: Available 24/7</li>
            <li>• Crisis Text Line: Text HOME to 741741</li>
            <li>• Talk to a trusted friend or family member</li>
          </ul>
        </div>
      </Card>
    </div>
  )
}
