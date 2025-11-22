"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Brain, Wind } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface MoodSuggestionsProps {
  emotion: string
}

interface Resource {
  title: string
  description: string
  category: string
  duration: string
}

const MOOD_RESOURCES: Record<string, Resource[]> = {
  Happy: [
    {
      title: "Building Healthy Relationships",
      description: "Tips for creating and maintaining supportive relationships.",
      category: "Relationships",
      duration: "8 min",
    },
    {
      title: "Sleep Hygiene for Better Mental Health",
      description: "How quality sleep impacts your mental wellness and recovery.",
      category: "Sleep",
      duration: "6 min",
    },
    {
      title: "Gratitude Meditation",
      description: "Cultivate appreciation for life's blessings.",
      category: "Beginner",
      duration: "10 min",
    },
    {
      title: "Energizing Breath",
      description: "Boost your vitality and maintain positive energy.",
      category: "Energy",
      duration: "5 min",
    },
  ],
  Sad: [
    {
      title: "Understanding Depression",
      description: "Comprehensive guide to recognizing and coping with depression.",
      category: "Depression",
      duration: "7 min",
    },
    {
      title: "Coping with Sadness",
      description: "Healthy strategies for managing difficult emotions.",
      category: "Emotions",
      duration: "6 min",
    },
    {
      title: "Compassion Meditation",
      description: "Be gentle and kind to yourself during difficult times.",
      category: "Beginner",
      duration: "12 min",
    },
    {
      title: "Calming Breath",
      description: "Soothe your nervous system gently.",
      category: "Calm",
      duration: "5 min",
    },
  ],
  Anxious: [
    {
      title: "Managing Anxiety: Practical Strategies",
      description: "Learn evidence-based techniques to manage anxiety symptoms daily.",
      category: "Anxiety",
      duration: "5 min",
    },
    {
      title: "Understanding Anxiety Triggers",
      description: "Identify and manage what causes your anxiety.",
      category: "Anxiety",
      duration: "6 min",
    },
    {
      title: "Anxiety Relief Meditation",
      description: "Guided meditation specifically for anxiety relief.",
      category: "Anxiety",
      duration: "10 min",
    },
    {
      title: "4-7-8 Breathing for Anxiety",
      description: "Powerful breathing technique to calm your nervous system.",
      category: "Anxiety",
      duration: "5 min",
    },
    {
      title: "Box Breathing",
      description: "Military technique for instant calm.",
      category: "Stress",
      duration: "3 min",
    },
  ],
  Stressed: [
    {
      title: "Stress Management Techniques",
      description: "Practical tools for reducing daily stress.",
      category: "Stress",
      duration: "8 min",
    },
    {
      title: "Work-Life Balance",
      description: "Create boundaries for better well-being.",
      category: "Lifestyle",
      duration: "7 min",
    },
    {
      title: "Mindfulness Body Scan",
      description: "Connect with your body and release tension.",
      category: "Intermediate",
      duration: "20 min",
    },
    {
      title: "Box Breathing",
      description: "Military-used technique for stress management.",
      category: "Stress",
      duration: "3 min",
    },
    {
      title: "Diaphragmatic Breathing",
      description: "Learn proper deep breathing techniques.",
      category: "Stress",
      duration: "7 min",
    },
  ],
  Angry: [
    {
      title: "Managing Anger Healthily",
      description: "Transform anger into constructive action.",
      category: "Anger",
      duration: "6 min",
    },
    {
      title: "Letting Go of Resentment",
      description: "Free yourself from negative emotions.",
      category: "Emotions",
      duration: "8 min",
    },
    {
      title: "Calming Meditation",
      description: "Cool down your heated emotions.",
      category: "Beginner",
      duration: "10 min",
    },
    {
      title: "Diaphragmatic Breathing",
      description: "Slow, deep breaths to calm anger.",
      category: "Calm",
      duration: "5 min",
    },
    {
      title: "Cooling Breath",
      description: "Lower your emotional temperature.",
      category: "Calm",
      duration: "5 min",
    },
  ],
}

export default function MoodSuggestions({ emotion }: MoodSuggestionsProps) {
  const resources = MOOD_RESOURCES[emotion] || MOOD_RESOURCES.Happy

  // Separate resources by type
  const articles = resources.filter(r => !r.title.includes("Meditation") && !r.title.includes("Breath"))
  const meditations = resources.filter(r => r.title.includes("Meditation"))
  const breathing = resources.filter(r => r.title.includes("Breath"))

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Wellness Resources</h2>
        <p className="text-muted-foreground text-sm">
          Curated content to support your mental health journey
        </p>
      </div>

      <Tabs defaultValue="articles" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-100">
          <TabsTrigger value="articles" className="gap-2">
            <BookOpen className="w-4 h-4" />
            Articles
          </TabsTrigger>
          <TabsTrigger value="meditations" className="gap-2">
            <Brain className="w-4 h-4" />
            Meditations
          </TabsTrigger>
          <TabsTrigger value="breathing" className="gap-2">
            <Wind className="w-4 h-4" />
            Breathing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="articles" className="space-y-4 mt-6">
          {articles.map((resource, index) => (
            <Card key={index} className="p-6 hover:shadow-md transition-shadow bg-white">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">{resource.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{resource.description}</p>
                  <div className="flex items-center gap-4">
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                      {resource.category}
                    </span>
                    <span className="text-xs text-muted-foreground">{resource.duration}</span>
                  </div>
                </div>
                <Button size="sm" className="ml-4 bg-blue-500 hover:bg-blue-600 text-white gap-2">
                  <BookOpen className="w-4 h-4" />
                  Read
                </Button>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="meditations" className="space-y-4 mt-6">
          {meditations.map((resource, index) => (
            <Card key={index} className="p-6 hover:shadow-md transition-shadow bg-white">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">{resource.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{resource.description}</p>
                  <div className="flex items-center gap-4">
                    <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                      {resource.category}
                    </span>
                    <span className="text-xs text-muted-foreground">{resource.duration}</span>
                  </div>
                </div>
                <Button size="sm" className="ml-4 bg-blue-500 hover:bg-blue-600 text-white gap-2">
                  ▶ Play
                </Button>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="breathing" className="space-y-4 mt-6">
          {breathing.map((resource, index) => (
            <Card key={index} className="p-6 hover:shadow-md transition-shadow bg-white">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">{resource.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{resource.description}</p>
                  <div className="flex items-center gap-4">
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                      {resource.category}
                    </span>
                    <span className="text-xs text-muted-foreground">{resource.duration}</span>
                  </div>
                </div>
                <Button size="sm" className="ml-4 bg-blue-500 hover:bg-blue-600 text-white gap-2">
                  ▶ Start
                </Button>
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
