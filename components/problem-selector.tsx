"use client"

import { useState } from "react"
import ProblemCategories from "./problem-categories"
import AIChat from "./ai-chat"
import { Card } from "@/components/ui/card"

interface ProblemSelectorProps {
  age: number
  user: {
    name: string
    pronouns?: string
  }
}

export default function ProblemSelector({ age, user }: ProblemSelectorProps) {
  const [step, setStep] = useState<"select" | "support">("select")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [otherText, setOtherText] = useState("")

  const handleCategorySelect = (categories: string[], other?: string) => {
    setSelectedCategories(categories)
    setOtherText(other || "")
    setStep("support")
  }

  return (
    <div>
      {step === "select" ? (
        <ProblemCategories age={age} onSelect={handleCategorySelect} />
      ) : (
        <div className="space-y-4">
          <Card className="p-4 bg-blue-50 border-blue-200">
            <p className="text-sm text-blue-900">
              Based on what you shared, here's personalized support for you, {user.pronouns || "friend"}:
            </p>
          </Card>
          <AIChat age={age} selectedCategories={selectedCategories} />
        </div>
      )}
    </div>
  )
}
