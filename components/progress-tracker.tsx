"use client"

import { useState } from "react"
import { Card } from "./ui/card"
import { Button } from "./ui/button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const SAMPLE_DATA = [
  { day: "Mon", mood: 6 },
  { day: "Tue", mood: 5 },
  { day: "Wed", mood: 7 },
  { day: "Thu", mood: 6 },
  { day: "Fri", mood: 8 },
  { day: "Sat", mood: 7 },
  { day: "Sun", mood: 8 },
]

export default function ProgressTracker() {
  const [moodScale, setMoodScale] = useState(7)

  const averageMood = (SAMPLE_DATA.reduce((sum, item) => sum + item.mood, 0) / SAMPLE_DATA.length).toFixed(1)

  const getMoodLabel = (value: number) => {
    if (value <= 3) return "Very Low"
    if (value <= 5) return "Low"
    if (value <= 7) return "Moderate"
    if (value <= 9) return "Good"
    return "Excellent"
  }

  return (
    <div className="space-y-6">
      {/* Daily Mood Rating */}
      <Card className="p-6 border-0 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground mb-4">Rate Your Current Mood</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Mood Level: {getMoodLabel(moodScale)}</span>
            <span className="text-2xl font-bold text-accent">{moodScale}/10</span>
          </div>
          <input
            type="range"
            min="0"
            max="10"
            value={moodScale}
            onChange={(e) => setMoodScale(Number.parseInt(e.target.value))}
            className="w-full h-2 rounded-lg bg-secondary/30 appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Very Low</span>
            <span>Excellent</span>
          </div>
          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg">
            Save Today's Mood
          </Button>
        </div>
      </Card>

      {/* Weekly Chart */}
      <Card className="p-6 border-0 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground mb-4">Weekly Mood Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={SAMPLE_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="day" stroke="var(--color-muted-foreground)" />
            <YAxis stroke="var(--color-muted-foreground)" domain={[0, 10]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-card)",
                border: "1px solid var(--color-border)",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "var(--color-foreground)" }}
            />
            <Line
              type="monotone"
              dataKey="mood"
              stroke="var(--color-primary)"
              strokeWidth={2}
              dot={{ fill: "var(--color-accent)", r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-4 p-4 bg-secondary/20 rounded-lg">
          <p className="text-sm text-foreground">
            <span className="font-semibold">Average Mood: </span>
            <span className="text-accent font-bold">{averageMood}/10</span>
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Your mood has been generally improving. Keep up the great work!
          </p>
        </div>
      </Card>

      {/* Insights */}
      <Card className="p-6 border-0 shadow-sm bg-accent/10">
        <h2 className="text-lg font-semibold text-foreground mb-4">Your Insights</h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="text-2xl">📈</span>
            <div>
              <p className="font-medium text-foreground">Positive Trend</p>
              <p className="text-sm text-muted-foreground">Your mood has improved by 2 points this week.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">✨</span>
            <div>
              <p className="font-medium text-foreground">Best Day</p>
              <p className="text-sm text-muted-foreground">Friday was your best day with a mood rating of 8/10.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">💪</span>
            <div>
              <p className="font-medium text-foreground">Keep Going</p>
              <p className="text-sm text-muted-foreground">You've been consistent with your check-ins this week!</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
