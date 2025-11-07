"use client"
import { useState } from "react"
import type React from "react"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"

interface ProblemCategoriesProps {
  age: number
  onSelect: (categories: string[], other?: string) => void
}

const categoryMap: Record<string, Array<{ id: string; label: string; icon: string }>> = {
  teen: [
    { id: "academic", label: "Academic Stress & Exam Pressure", icon: "📚" },
    { id: "bullying", label: "Peer Pressure & Bullying", icon: "👥" },
    { id: "social-media", label: "Social Media Anxiety & Comparison", icon: "📱" },
    { id: "identity", label: "Identity & Self-Esteem Issues", icon: "🎭" },
    { id: "heartbreak", label: "First Relationships & Heartbreak", icon: "💔" },
    { id: "family", label: "Family Conflicts & Parental Expectations", icon: "🏠" },
    { id: "gaming", label: "Gaming/Screen Addiction", icon: "🎮" },
    { id: "anxiety", label: "Anxiety & Depression Symptoms", icon: "😰" },
  ],
  young_adult: [
    { id: "career", label: "Career Confusion & Job Search Stress", icon: "💼" },
    { id: "financial", label: "Financial Pressure & Student Loans", icon: "💰" },
    { id: "dating", label: "Romantic Relationships & Dating Anxiety", icon: "❤️" },
    { id: "college", label: "College/University Adjustment Issues", icon: "🎓" },
    { id: "independence", label: "Living Independently for First Time", icon: "🏡" },
    { id: "loneliness", label: "Friendship Dynamics & Loneliness", icon: "🤝" },
    { id: "purpose", label: "Purpose & Direction in Life", icon: "🎯" },
    { id: "mental-health", label: "Mental Health (Anxiety/Depression)", icon: "🧠" },
  ],
  professional: [
    { id: "parenting", label: "Parenting Challenges & Child Behavior", icon: "👶" },
    { id: "marriage", label: "Marriage/Partnership Issues", icon: "💑" },
    { id: "worklife", label: "Work-Life Balance Struggles", icon: "⚖️" },
    { id: "money", label: "Financial Stress (Mortgage, EMIs, Savings)", icon: "💵" },
    { id: "aging-parents", label: "Caring for Aging Parents", icon: "👴" },
    { id: "career-change", label: "Career Stagnation or Change", icon: "🔄" },
    { id: "postpartum", label: "Pregnancy/Postpartum Challenges", icon: "🤰" },
    { id: "burnout", label: "Burnout & Exhaustion", icon: "😓" },
  ],
  senior: [
    { id: "health", label: "Health Issues & Chronic Conditions", icon: "🏥" },
    { id: "medication", label: "Medication Management Concerns", icon: "💊" },
    { id: "isolation", label: "Loneliness & Social Isolation", icon: "😔" },
    { id: "aging", label: "Aging & Loss of Independence", icon: "🧓" },
    { id: "grief", label: "Grief & Loss (spouse, friends)", icon: "💔" },
    { id: "retirement", label: "Retirement Adjustment", icon: "🏠" },
    { id: "family-relationships", label: "Strained Family Relationships", icon: "👨‍👩‍👧‍👦" },
    { id: "cognitive", label: "Memory & Cognitive Concerns", icon: "🧠" },
  ],
}

export default function ProblemCategories({ age, onSelect }: ProblemCategoriesProps) {
  const getAgeGroup = (age: number) => {
    if (age >= 13 && age < 18) return "teen"
    if (age >= 18 && age < 25) return "young_adult"
    if (age >= 25 && age < 50) return "professional"
    if (age >= 50) return "senior"
    return "young_adult"
  }

  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [otherText, setOtherText] = useState("")
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const ageGroup = getAgeGroup(age)
  const categories = categoryMap[ageGroup] || categoryMap["young_adult"]

  const handleToggleCategory = (id: string) => {
    setSelectedCategories((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]))
  }

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    setDraggedItem(id)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverIndex(index)
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault()
    if (!draggedItem) return

    const dragIndex = selectedCategories.indexOf(draggedItem)
    if (dragIndex === -1) return

    const newCategories = [...selectedCategories]
    newCategories.splice(dragIndex, 1)
    newCategories.splice(dropIndex, 0, draggedItem)

    setSelectedCategories(newCategories)
    setDraggedItem(null)
    setDragOverIndex(null)
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
    setDragOverIndex(null)
  }

  const handleSubmit = () => {
    if (selectedCategories.length > 0 || otherText.trim()) {
      onSelect(selectedCategories, otherText)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">What's on your mind?</h2>
        <p className="text-muted-foreground">
          Select one or more areas you'd like support with (you can select multiple)
        </p>
      </div>

      {selectedCategories.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 space-y-3">
          <p className="text-sm font-semibold text-blue-900">Your selected priorities (drag to reorder):</p>
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map((catId, index) => {
              const category = categories.find((c) => c.id === catId)
              return (
                <div
                  key={catId}
                  draggable
                  onDragStart={(e) => handleDragStart(e, catId)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center gap-2 px-3 py-2 bg-white border-2 rounded-lg cursor-move transition-all ${
                    dragOverIndex === index
                      ? "border-blue-500 shadow-lg scale-105"
                      : "border-blue-200 hover:border-blue-400"
                  } ${draggedItem === catId ? "opacity-50" : ""}`}
                >
                  <span className="text-lg">{category?.icon}</span>
                  <span className="text-sm font-medium text-foreground">{category?.label}</span>
                  <span className="text-xs text-muted-foreground ml-1">≡</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {categories.map((category) => (
          <Card
            key={category.id}
            className={`p-4 cursor-pointer transition-all hover:shadow-md ${
              selectedCategories.includes(category.id) ? "ring-2 ring-blue-400 bg-blue-50" : ""
            }`}
            onClick={() => handleToggleCategory(category.id)}
          >
            <div className="flex items-start gap-3">
              <Checkbox checked={selectedCategories.includes(category.id)} className="mt-1" />
              <div className="flex-1">
                <span className="text-2xl">{category.icon}</span>
                <p className="text-sm font-medium text-foreground">{category.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">Other (please describe)</label>
        <Textarea
          placeholder="Is there something else on your mind? You can share it here..."
          value={otherText}
          onChange={(e) => setOtherText(e.target.value)}
          className="bg-secondary/20 border-secondary/30 rounded-lg min-h-24"
        />
      </div>

      <Button
        onClick={handleSubmit}
        disabled={selectedCategories.length === 0 && !otherText.trim()}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-11 font-semibold"
      >
        Continue to Support
      </Button>
    </div>
  )
}
