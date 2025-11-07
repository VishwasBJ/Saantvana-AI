"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Send, AlertTriangle, Phone } from "lucide-react"
import { getDetailedResponse, detectEmotionalTone } from "@/lib/ai-response-engine"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface AIChatProps {
  age: number
  selectedCategories: string[]
}

const CRISIS_KEYWORDS = [
  "suicide",
  "kill myself",
  "harm myself",
  "want to die",
  "end it all",
  "no point",
  "self harm",
  "cut myself",
  "hurt myself",
]

const HELPLINE_NUMBERS: Record<string, string> = {
  us: "988 (Suicide & Crisis Lifeline)",
  uk: "116 123 (Samaritans)",
  india: "9152987821 (iCall)",
  international: "https://findahelpline.com",
}

export default function AIChat({ age, selectedCategories }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [showCrisisAlert, setShowCrisisAlert] = useState(false)
  const [isCrisis, setIsCrisis] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const detectCrisis = (text: string): boolean => {
    const lowerText = text.toLowerCase()
    return CRISIS_KEYWORDS.some((keyword) => lowerText.includes(keyword))
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const hasCrisisIndicators = detectCrisis(input)
    if (hasCrisisIndicators) {
      setIsCrisis(true)
      setShowCrisisAlert(true)
    }

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    const userInput = input
    setInput("")
    setLoading(true)

    setTimeout(() => {
      // Get conversation history for context
      const conversationHistory = messages.map((m) => m.content)
      const emotionalTone = detectEmotionalTone(userInput)

      const response: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getDetailedResponse(userInput, emotionalTone, age, conversationHistory),
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, response])
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="flex flex-col h-full">
      <AlertDialog open={showCrisisAlert} onOpenChange={setShowCrisisAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              We're Here for You
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p>
                I've detected that you might be in distress. Your safety is our priority, and I want to make sure you
                have immediate support.
              </p>
              <p className="font-semibold text-foreground">Crisis Support Resources:</p>
              <ul className="space-y-1 text-sm">
                <li>US: 988 (Suicide & Crisis Lifeline) - Free & Confidential</li>
                <li>UK: 116 123 (Samaritans) - Available 24/7</li>
                <li>India: 9152987821 (iCall) - Mental Health Support</li>
              </ul>
              <p className="text-sm italic text-muted-foreground">
                You can also reach out to a trusted friend, family member, or visit your nearest emergency room.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2">
            <AlertDialogCancel>Continue Chatting</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700">
              <Phone className="w-4 h-4 mr-2" />
              Call Helpline
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex-1 overflow-y-auto space-y-4 p-4 mb-4 bg-secondary/5 rounded-lg">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-3">
            <div className="text-4xl">🧠</div>
            <p className="text-muted-foreground">
              Hi, I'm your AI mental wellness companion. Feel free to share what's on your mind.
            </p>
            <p className="text-xs text-muted-foreground">
              This conversation is confidential and designed to provide support, not medical advice.
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-none"
                  : "bg-card text-foreground border border-border rounded-bl-none"
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p
                className={`text-xs mt-1 ${message.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground"}`}
              >
                {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-card text-foreground border border-border px-4 py-2 rounded-lg rounded-bl-none">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="space-y-2">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Share your thoughts or concerns..."
            className="bg-secondary/20 border-secondary/30 rounded-xl"
            disabled={loading}
          />
          <Button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground text-center">
          This is an AI companion. For emergencies, always contact local emergency services.
        </p>
      </form>
    </div>
  )
}
