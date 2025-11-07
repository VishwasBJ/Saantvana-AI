"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Heart, Smile, Frown, Meh } from "lucide-react"

interface JournalEntry {
  id: string
  date: string
  mood: "happy" | "neutral" | "sad" | "anxious"
  content: string
  createdAt: Date
}

const MOOD_OPTIONS = [
  { id: "happy", label: "Happy", icon: Smile, color: "text-yellow-500" },
  { id: "neutral", label: "Neutral", icon: Meh, color: "text-blue-500" },
  { id: "sad", label: "Sad", icon: Frown, color: "text-purple-500" },
  { id: "anxious", label: "Anxious", icon: Heart, color: "text-red-500" },
]

export default function Journal() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [selectedMood, setSelectedMood] = useState<string>("neutral")
  const [entryText, setEntryText] = useState("")
  const [viewMode, setViewMode] = useState<"write" | "view">("write")

  useEffect(() => {
    const saved = localStorage.getItem("journal-entries")
    if (saved) {
      const parsed = JSON.parse(saved)
      setEntries(
        parsed.map((entry: any) => ({
          ...entry,
          createdAt: new Date(entry.createdAt),
        })),
      )
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("journal-entries", JSON.stringify(entries))
  }, [entries])

  const handleSaveEntry = () => {
    if (!entryText.trim()) return

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      mood: selectedMood as any,
      content: entryText,
      createdAt: new Date(),
    }

    setEntries((prev) => [newEntry, ...prev])
    setEntryText("")
    setSelectedMood("neutral")
  }

  const getMoodStats = () => {
    const moodCounts = entries.reduce(
      (acc, entry) => {
        acc[entry.mood] = (acc[entry.mood] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )
    return moodCounts
  }

  const moodStats = getMoodStats()

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Button
          onClick={() => setViewMode("write")}
          variant={viewMode === "write" ? "default" : "outline"}
          className="rounded-lg"
        >
          New Entry
        </Button>
        <Button
          onClick={() => setViewMode("view")}
          variant={viewMode === "view" ? "default" : "outline"}
          className="rounded-lg"
        >
          Past Entries
        </Button>
      </div>

      {viewMode === "write" ? (
        <Card className="p-6 space-y-4">
          <div>
            <p className="text-sm font-medium text-foreground mb-3">How are you feeling today?</p>
            <div className="grid grid-cols-4 gap-2">
              {MOOD_OPTIONS.map((mood) => {
                const Icon = mood.icon
                return (
                  <button
                    key={mood.id}
                    onClick={() => setSelectedMood(mood.id)}
                    className={`p-3 rounded-lg transition-all flex flex-col items-center gap-1 ${
                      selectedMood === mood.id
                        ? "bg-primary/20 border-2 border-primary"
                        : "bg-secondary/10 border border-border hover:bg-secondary/20"
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${mood.color}`} />
                    <span className="text-xs text-foreground">{mood.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">Your thoughts</label>
            <Textarea
              value={entryText}
              onChange={(e) => setEntryText(e.target.value)}
              placeholder="Write freely about your day, feelings, or anything on your mind. This is your private space..."
              className="bg-secondary/20 border-secondary/30 rounded-lg min-h-48"
            />
          </div>

          <Button
            onClick={handleSaveEntry}
            disabled={!entryText.trim()}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
          >
            Save Entry
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {entries.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No journal entries yet. Start writing to track your journey.</p>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-4 gap-2">
                {MOOD_OPTIONS.map((mood) => (
                  <Card key={mood.id} className="p-3 text-center">
                    <p className="text-sm font-semibold text-foreground">{moodStats[mood.id] || 0}</p>
                    <p className="text-xs text-muted-foreground">{mood.label}</p>
                  </Card>
                ))}
              </div>

              <div className="space-y-3">
                {entries.map((entry) => {
                  const mood = MOOD_OPTIONS.find((m) => m.id === entry.mood)
                  const Icon = mood?.icon || Smile
                  return (
                    <Card key={entry.id} className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className={`w-4 h-4 ${mood?.color}`} />
                          <p className="text-sm font-medium text-foreground">{entry.date}</p>
                        </div>
                        <Badge variant="outline">{mood?.label}</Badge>
                      </div>
                      <p className="text-sm text-foreground/80 line-clamp-3">{entry.content}</p>
                    </Card>
                  )
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
