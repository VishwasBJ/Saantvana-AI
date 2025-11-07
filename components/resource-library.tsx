"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Music, Wind, Play } from "lucide-react"

const RESOURCES = {
  articles: [
    {
      id: 1,
      title: "Managing Anxiety: Practical Strategies",
      category: "Anxiety",
      readTime: "5 min",
      description: "Learn evidence-based techniques to manage anxiety symptoms daily.",
    },
    {
      id: 2,
      title: "Understanding Depression",
      category: "Depression",
      readTime: "7 min",
      description: "Comprehensive guide to recognizing and coping with depression.",
    },
    {
      id: 3,
      title: "Sleep Hygiene for Better Mental Health",
      category: "Sleep",
      readTime: "6 min",
      description: "How quality sleep impacts your mental wellness and recovery.",
    },
    {
      id: 4,
      title: "Building Healthy Relationships",
      category: "Relationships",
      readTime: "8 min",
      description: "Tips for creating and maintaining supportive relationships.",
    },
  ],
  meditations: [
    {
      id: 1,
      title: "5-Minute Calming Meditation",
      duration: "5 min",
      category: "Beginner",
      description: "Perfect for starting your day with calm and focus.",
    },
    {
      id: 2,
      title: "Anxiety Relief Meditation",
      duration: "10 min",
      category: "Anxiety",
      description: "Guided meditation specifically for anxiety relief.",
    },
    {
      id: 3,
      title: "Sleep Preparation Meditation",
      duration: "15 min",
      category: "Sleep",
      description: "Wind down and prepare for restful sleep.",
    },
    {
      id: 4,
      title: "Mindfulness Body Scan",
      duration: "20 min",
      category: "Intermediate",
      description: "Connect with your body and release tension.",
    },
  ],
  breathing: [
    {
      id: 1,
      title: "4-7-8 Breathing for Anxiety",
      duration: "5 min",
      description: "Powerful breathing technique to calm your nervous system.",
    },
    {
      id: 2,
      title: "Box Breathing",
      duration: "3 min",
      description: "Military-used technique for stress management.",
    },
    {
      id: 3,
      title: "Diaphragmatic Breathing",
      duration: "7 min",
      description: "Learn proper deep breathing techniques.",
    },
  ],
}

export default function ResourceLibrary() {
  const [selectedResource, setSelectedResource] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Wellness Resources</h2>
        <p className="text-muted-foreground">Curated content to support your mental health journey</p>
      </div>

      <Tabs defaultValue="articles" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 rounded-lg">
          <TabsTrigger value="articles" className="gap-2">
            <BookOpen className="w-4 h-4" />
            Articles
          </TabsTrigger>
          <TabsTrigger value="meditations" className="gap-2">
            <Music className="w-4 h-4" />
            Meditations
          </TabsTrigger>
          <TabsTrigger value="breathing" className="gap-2">
            <Wind className="w-4 h-4" />
            Breathing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="articles" className="space-y-3">
          {RESOURCES.articles.map((article) => (
            <Card key={article.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{article.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{article.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">{article.category}</span>
                    <span className="text-xs text-muted-foreground">{article.readTime}</span>
                  </div>
                  <Button size="sm" variant="default" className="rounded">
                    <BookOpen className="w-3 h-3 mr-1" />
                    Read
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="meditations" className="space-y-3">
          {RESOURCES.meditations.map((meditation) => (
            <Card key={meditation.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{meditation.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{meditation.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">{meditation.category}</span>
                    <span className="text-xs text-muted-foreground">{meditation.duration}</span>
                  </div>
                  <Button size="sm" variant="default" className="rounded gap-1">
                    <Play className="w-3 h-3" />
                    Play
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="breathing" className="space-y-3">
          {RESOURCES.breathing.map((technique) => (
            <Card key={technique.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{technique.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{technique.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{technique.duration}</span>
                  <Button size="sm" variant="default" className="rounded gap-1">
                    <Wind className="w-3 h-3" />
                    Start
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
