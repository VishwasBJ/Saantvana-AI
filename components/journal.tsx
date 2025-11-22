"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Heart, Smile, Frown, Meh, BookOpen } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

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
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load entries from localStorage on mount
  useEffect(() => {
    try {
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
    } catch (error) {
      console.error("Error loading journal entries:", error)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Save entries to localStorage whenever they change (but only after initial load)
  useEffect(() => {
    if (isLoaded && entries.length >= 0) {
      try {
        localStorage.setItem("journal-entries", JSON.stringify(entries))
      } catch (error) {
        console.error("Error saving journal entries:", error)
      }
    }
  }, [entries, isLoaded])

  const handleSaveEntry = () => {
    if (!entryText.trim()) return

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      mood: selectedMood as any,
      content: entryText,
      createdAt: new Date(),
    }

    setEntries((prev) => {
      const updated = [newEntry, ...prev]
      return updated
    })
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

              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3">
                {entries.map((entry) => {
                  const mood = MOOD_OPTIONS.find((m) => m.id === entry.mood)
                  const Icon = mood?.icon || Smile
                  return (
                    <button
                      key={entry.id}
                      onClick={() => {
                        setSelectedEntry(entry)
                        setIsDialogOpen(true)
                      }}
                      className="group relative aspect-square rounded-lg overflow-hidden transition-all hover:scale-110 hover:shadow-xl hover:z-10"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-orange-50 to-amber-200 dark:from-amber-900 dark:via-orange-900 dark:to-amber-800" />
                      
                      {/* Diary binding effect */}
                      <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-amber-800/30 to-transparent" />
                      <div className="absolute left-1 top-2 bottom-2 w-px bg-amber-900/20" />
                      
                      {/* Content */}
                      <div className="relative h-full p-2 flex flex-col items-center justify-center text-center">
                        <BookOpen className="w-4 h-4 text-amber-700 dark:text-amber-300 mb-1" />
                        <Icon className={`w-4 h-4 ${mood?.color} mb-1`} />
                        <p className="text-[8px] font-semibold text-amber-900 dark:text-amber-100 leading-tight">
                          {entry.date.split('/').slice(0, 2).join('/')}
                        </p>
                      </div>
                      
                      {/* Decorative corner */}
                      <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-amber-700/30" />
                    </button>
                  )
                })}
              </div>

              {/* Dialog for viewing full entry */}
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 dark:from-amber-950 dark:via-orange-950 dark:to-amber-900">
                  {selectedEntry && (
                    <>
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-3 text-amber-900 dark:text-amber-100">
                          {(() => {
                            const mood = MOOD_OPTIONS.find((m) => m.id === selectedEntry.mood)
                            const Icon = mood?.icon || Smile
                            return <Icon className={`w-6 h-6 ${mood?.color}`} />
                          })()}
                          <div>
                            <p className="text-lg font-semibold">{selectedEntry.date}</p>
                            <p className="text-sm font-normal text-amber-700 dark:text-amber-300">
                              {MOOD_OPTIONS.find((m) => m.id === selectedEntry.mood)?.label}
                            </p>
                          </div>
                        </DialogTitle>
                      </DialogHeader>
                      
                      <div className="mt-4 p-6 bg-white/50 dark:bg-black/20 rounded-lg border-2 border-amber-200 dark:border-amber-800 shadow-inner">
                        <p className="text-amber-900 dark:text-amber-100 whitespace-pre-wrap leading-relaxed">
                          {selectedEntry.content}
                        </p>
                      </div>
                    </>
                  )}
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      )}
    </div>
  )
}
